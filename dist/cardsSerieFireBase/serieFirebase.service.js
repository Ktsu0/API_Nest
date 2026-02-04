"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerieFirebaseService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../fireBase/firebase.service");
const levenshtein = __importStar(require("fast-levenshtein"));
let SerieFirebaseService = class SerieFirebaseService {
    firebase;
    constructor(firebase) {
        this.firebase = firebase;
    }
    get collection() {
        return this.firebase.db.collection('series');
    }
    normalize(texto) {
        return (texto || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }
    formatSerie(serie) {
        return {
            ...serie,
            valorUnitario: Number(serie.valorUnitario || 0),
            avaliacao: serie.avaliacao !== undefined ? Number(serie.avaliacao) : undefined,
        };
    }
    mapFirestoreSerie(id, data) {
        return {
            id,
            titulo: String(data.titulo || ''),
            meta: {
                temporada: String(data.meta?.temporada || ''),
                tema: String(data.meta?.tema || ''),
            },
            detalhes: String(data.detalhes || ''),
            imagem: String(data.imagem || ''),
            estoque: Number(data.estoque || 0),
            valorUnitario: Number(data.valorUnitario || 0),
            votos: Number(data.votos || 0),
            avaliacao: data.avaliacao !== undefined ? Number(data.avaliacao) : undefined,
            tipo: data.tipo ? String(data.tipo) : undefined,
        };
    }
    async findAll() {
        const snapshot = await this.collection.orderBy('titulo').get();
        return snapshot.docs.map((doc) => this.formatSerie(this.mapFirestoreSerie(doc.id, doc.data())));
    }
    async findOne(id) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Série com ID "${id}" não encontrada.`);
        }
        return this.formatSerie(this.mapFirestoreSerie(doc.id, doc.data()));
    }
    async findTema(tema) {
        const temaBusca = this.normalize(tema);
        const snapshot = await this.collection
            .where('meta.tema_normalized', '>=', temaBusca)
            .where('meta.tema_normalized', '<=', temaBusca + '\uf8ff')
            .get();
        return snapshot.docs.map((doc) => this.formatSerie(this.mapFirestoreSerie(doc.id, doc.data())));
    }
    async findTitulo(searchTerm) {
        const termBusca = this.normalize(searchTerm);
        const snapshot = await this.collection.get();
        const series = snapshot.docs.map((doc) => this.mapFirestoreSerie(doc.id, doc.data()));
        let filtered = series.filter((serie) => this.normalize(serie.titulo).includes(termBusca));
        if (!filtered.length && termBusca.length >= 3) {
            const MAX_DISTANCE = termBusca.length > 8 ? 2 : termBusca.length > 5 ? 1 : 0;
            filtered = series.filter((serie) => {
                const distance = levenshtein.get(termBusca, this.normalize(serie.titulo));
                return distance <= MAX_DISTANCE;
            });
        }
        return filtered.map((s) => this.formatSerie(s));
    }
    async addSerie(data) {
        const ref = this.collection.doc();
        const payload = {
            titulo: data.titulo,
            titulo_normalized: this.normalize(data.titulo),
            detalhes: data.detalhes,
            imagem: data.imagem,
            estoque: Number(data.estoque),
            valorUnitario: Number(data.valorUnitario),
            avaliacao: data.avaliacao ? Number(data.avaliacao) : undefined,
            votos: 0,
            tipo: 'SERIE',
            meta: {
                temporada: String(data.meta?.temporada || ''),
                tema: String(data.meta?.tema || ''),
                tema_normalized: this.normalize(data.meta?.tema || ''),
            },
            createdAt: new Date(),
        };
        await ref.set(payload);
        return this.formatSerie(this.mapFirestoreSerie(ref.id, payload));
    }
    async updateSerie(id, updatedData) {
        const ref = this.collection.doc(id);
        const snap = await ref.get();
        if (!snap.exists) {
            throw new common_1.NotFoundException(`Série com ID "${id}" não encontrada.`);
        }
        const patch = {
            ...(updatedData.titulo && {
                titulo: updatedData.titulo,
                titulo_normalized: this.normalize(updatedData.titulo),
            }),
            ...(updatedData.detalhes && { detalhes: updatedData.detalhes }),
            ...(updatedData.imagem && { imagem: updatedData.imagem }),
            ...(updatedData.estoque !== undefined && {
                estoque: Number(updatedData.estoque),
            }),
            ...(updatedData.valorUnitario !== undefined && {
                valorUnitario: Number(updatedData.valorUnitario),
            }),
            ...(updatedData.avaliacao !== undefined && {
                avaliacao: Number(updatedData.avaliacao),
            }),
            ...(updatedData.meta && {
                meta: {
                    ...snap.data()?.meta,
                    ...(updatedData.meta.temporada && {
                        temporada: updatedData.meta.temporada,
                    }),
                    ...(updatedData.meta.tema && {
                        tema: updatedData.meta.tema,
                        tema_normalized: this.normalize(updatedData.meta.tema),
                    }),
                },
            }),
            updatedAt: new Date(),
        };
        await ref.update(patch);
        return this.findOne(id);
    }
    async deleteSerie(id) {
        const ref = this.collection.doc(id);
        const snap = await ref.get();
        if (!snap.exists) {
            throw new common_1.NotFoundException(`Série com ID "${id}" não encontrada ou erro ao deletar.`);
        }
        await ref.delete();
        return `Série removida com sucesso.`;
    }
    async addAvaliacao(id, avaliacao) {
        const ref = this.collection.doc(id);
        return this.firebase.db.runTransaction(async (tx) => {
            const snap = (await tx.get(ref));
            if (!snap.exists) {
                throw new common_1.NotFoundException(`Série com ID "${id}" não encontrada.`);
            }
            const data = snap.data();
            const votos = Number(data.votos || 0);
            const somaAtual = Number(data.avaliacao || 0) * votos;
            const totalVotos = votos + 1;
            const novaMedia = (somaAtual + Number(avaliacao)) / totalVotos;
            tx.update(ref, {
                avaliacao: Number(novaMedia.toFixed(2)),
                votos: totalVotos,
                updatedAt: new Date(),
            });
            return `Avaliação de ${avaliacao} processada. Nova média: ${novaMedia.toFixed(2)}`;
        });
    }
    async atualizarEstoque(id, quantidade) {
        const ref = this.collection.doc(id);
        return this.firebase.db.runTransaction(async (tx) => {
            const snap = (await tx.get(ref));
            if (!snap.exists) {
                throw new common_1.NotFoundException(`Série com ID "${id}" não encontrada.`);
            }
            const data = snap.data();
            const estoqueAtual = Number(data.estoque || 0);
            const novoEstoque = estoqueAtual - Number(quantidade);
            tx.update(ref, {
                estoque: novoEstoque,
                updatedAt: new Date(),
            });
            return this.findOne(id);
        });
    }
    async ordemAlfabetica() {
        return this.findAll();
    }
};
exports.SerieFirebaseService = SerieFirebaseService;
exports.SerieFirebaseService = SerieFirebaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], SerieFirebaseService);
//# sourceMappingURL=serieFirebase.service.js.map