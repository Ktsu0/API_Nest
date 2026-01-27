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
exports.AnimeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
const levenshtein = __importStar(require("fast-levenshtein"));
let AnimeService = class AnimeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalize(texto) {
        return (texto || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }
    formatAnime(anime) {
        if (!anime)
            return anime;
        return {
            ...anime,
            valorUnitario: anime.valorUnitario ? Number(anime.valorUnitario) : 0,
            avaliacao: anime.avaliacao ? Number(anime.avaliacao) : null,
        };
    }
    async findAll() {
        const all = await this.prisma.serie.findMany({
            include: { meta: true },
            orderBy: { titulo: 'asc' },
        });
        return all
            .filter((s) => s.tipo === client_1.ProdutoTipo.ANIME)
            .map((a) => this.formatAnime(a));
    }
    async findOne(id) {
        const anime = await this.prisma.serie.findUnique({
            where: { id },
            include: { meta: true },
        });
        if (!anime)
            throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrado.`);
        return this.formatAnime(anime);
    }
    async findTema(tema) {
        const temaBusca = this.normalize(tema);
        const all = await this.prisma.serie.findMany({
            include: { meta: true },
        });
        return all
            .filter((s) => s.tipo === client_1.ProdutoTipo.ANIME &&
            this.normalize(s.meta?.tema).includes(temaBusca))
            .map((a) => this.formatAnime(a));
    }
    async findTitulo(searchTerm) {
        const termBusca = this.normalize(searchTerm);
        const all = await this.prisma.serie.findMany({
            include: { meta: true },
        });
        let filtered = all.filter((s) => s.tipo === client_1.ProdutoTipo.ANIME &&
            this.normalize(s.titulo).includes(termBusca));
        if (!filtered.length && termBusca.length >= 3) {
            const MAX_DISTANCE = termBusca.length > 8 ? 2 : termBusca.length > 5 ? 1 : 0;
            filtered = all.filter((serie) => {
                if (serie.tipo !== client_1.ProdutoTipo.ANIME)
                    return false;
                const distance = levenshtein.get(termBusca, this.normalize(serie.titulo));
                return distance <= MAX_DISTANCE;
            });
        }
        return filtered.map((a) => this.formatAnime(a));
    }
    async addAvaliacao(id, avaliacao) {
        return this.prisma.$transaction(async (tx) => {
            try {
                await tx.serie.update({
                    where: { id },
                    data: { avaliacao: Number(avaliacao) },
                });
                return `Avaliação adicionada com sucesso.`;
            }
            catch {
                throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrado.`);
            }
        });
    }
    async atualizarEstoque(id, quantidade) {
        return this.prisma.$transaction(async (tx) => {
            try {
                return await tx.serie.update({
                    where: { id },
                    data: { estoque: { decrement: Number(quantidade) } },
                });
            }
            catch {
                throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrado.`);
            }
        });
    }
    async addAnime(data) {
        console.log('[AnimeService] Recebido dados para criar:', JSON.stringify(data));
        return this.prisma.$transaction(async (tx) => {
            const tipoFinal = data.tipo?.toUpperCase() === 'SERIE'
                ? client_1.ProdutoTipo.SERIE
                : client_1.ProdutoTipo.ANIME;
            console.log(`[AnimeService] Classificando como: ${tipoFinal}`);
            const created = await tx.serie.create({
                data: {
                    titulo: data.titulo,
                    detalhes: data.detalhes,
                    imagem: data.imagem,
                    estoque: Number(data.estoque),
                    valorUnitario: Number(data.valorUnitario),
                    avaliacao: data.avaliacao ? Number(data.avaliacao) : null,
                    tipo: tipoFinal,
                    meta: {
                        create: {
                            temporada: String(data.meta.temporada),
                            tema: this.normalize(data.meta.tema),
                        },
                    },
                },
                include: { meta: true },
            });
            console.log('[AnimeService] Objeto criado no banco:', JSON.stringify(created));
            return this.formatAnime(created);
        });
    }
    async updateAnime(id, updatedData) {
        return this.prisma.$transaction(async (tx) => {
            try {
                const updated = await tx.serie.update({
                    where: { id },
                    data: {
                        titulo: updatedData.titulo,
                        detalhes: updatedData.detalhes,
                        imagem: updatedData.imagem,
                        estoque: updatedData.estoque !== undefined
                            ? Number(updatedData.estoque)
                            : undefined,
                        valorUnitario: updatedData.valorUnitario !== undefined
                            ? Number(updatedData.valorUnitario)
                            : undefined,
                        avaliacao: updatedData.avaliacao !== undefined
                            ? Number(updatedData.avaliacao)
                            : undefined,
                        meta: updatedData.meta
                            ? {
                                update: {
                                    temporada: updatedData.meta.temporada,
                                    tema: updatedData.meta.tema
                                        ? this.normalize(updatedData.meta.tema)
                                        : undefined,
                                },
                            }
                            : undefined,
                    },
                    include: { meta: true },
                });
                return this.formatAnime(updated);
            }
            catch (e) {
                throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrado.`);
            }
        });
    }
    async deleteAnime(id) {
        console.log(`[AnimeService] Tentando deletar anime ID: ${id}`);
        return this.prisma.$transaction(async (tx) => {
            try {
                const deleted = await tx.serie.delete({ where: { id } });
                console.log(`[AnimeService] Anime ID: ${id} deletada com sucesso. Titulo: ${deleted.titulo}`);
                return `Anime removido com sucesso.`;
            }
            catch (e) {
                console.error(`[AnimeService] Erro ao deletar anime ID: ${id}`, e);
                throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrado ou erro ao deletar.`);
            }
        });
    }
    async ordemAlfabetica() {
        return this.findAll();
    }
};
exports.AnimeService = AnimeService;
exports.AnimeService = AnimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnimeService);
//# sourceMappingURL=anime.service.js.map