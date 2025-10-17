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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesService = void 0;
const common_1 = require("@nestjs/common");
const bancoDados_1 = require("./models/bancoDados");
const levenshtein = __importStar(require("fast-levenshtein"));
let SeriesService = class SeriesService {
    series = bancoDados_1.topSeries;
    findAll() {
        return this.series;
    }
    findOne(id) {
        const serieEncontrada = this.series.find((serie) => serie.id === id);
        if (!serieEncontrada) {
            throw new common_1.NotFoundException(`Série com ID "${id}" não encontrada.`);
        }
        return serieEncontrada;
    }
    findTema(tema) {
        const temaBusca = this.normalize(tema);
        const seriesFiltradas = this.series.filter((serie) => {
            const temaSerie = this.normalize(serie.descricao.tema);
            return temaSerie.includes(temaBusca);
        });
        if (seriesFiltradas.length === 0) {
            throw new common_1.NotFoundException(`Série com tema "${tema}" não encontrada.`);
        }
        return seriesFiltradas;
    }
    normalize(texto) {
        return texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }
    addSerie(serie) {
        const novoId = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
        const novaSerie = { ...serie, id: novoId };
        this.series.push(novaSerie);
        return novaSerie;
    }
    updateImage(id, novaImagem) {
        const serieEncontrada = this.series.find((serie) => serie.id === id);
        if (!serieEncontrada) {
            throw new common_1.NotFoundException(`Série com ID "${id}" não encontrada.`);
        }
        serieEncontrada.imagem = novaImagem;
        return serieEncontrada;
    }
    ordemAlfabetica() {
        const seriesCopia = [...this.series];
        seriesCopia.sort((a, b) => a.titulo.localeCompare(b.titulo));
        return seriesCopia;
    }
    addAvaliacao(id, avaliacao) {
        const serie = this.series.find((s) => s.id === id);
        if (!serie) {
            throw new Error(`Série com ID "${id}" não encontrada.`);
        }
        serie.avaliacao = avaliacao;
    }
    findTitulo(searchTerm) {
        const termBusca = this.normalize(searchTerm);
        let seriesFiltradas = this.series.filter((serie) => {
            const tituloSerie = this.normalize(serie.titulo);
            return tituloSerie.includes(termBusca);
        });
        if (seriesFiltradas.length === 0 && termBusca.length >= 3) {
            const MAX_DISTANCE = termBusca.length > 8 ? 2 : termBusca.length > 5 ? 1 : 0;
            seriesFiltradas = this.series.filter((serie) => {
                const tituloSerie = this.normalize(serie.titulo);
                const distance = levenshtein.get(termBusca, tituloSerie);
                return distance <= MAX_DISTANCE;
            });
        }
        return seriesFiltradas;
    }
    updateSerie(id, updatedData) {
        const index = this.series.findIndex((serie) => serie.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Série com ID "${id}" não encontrada.`);
        }
        const current = this.series[index];
        this.series[index] = {
            ...current,
            ...updatedData,
            descricao: {
                ...current.descricao,
                ...(updatedData.descricao || {}),
            },
        };
        return this.series[index];
    }
    deleteSerie(id) {
        const index = this.series.findIndex((serie) => serie.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Série com ID "${id}" não encontrada.`);
        }
        const titulo = this.series[index].titulo;
        this.series.splice(index, 1);
        return `Série "${titulo}" removida com sucesso.`;
    }
    atualizarEstoque(id, quantidade) {
        const serie = this.series.find((s) => s.id === id);
        if (!serie) {
            throw new common_1.NotFoundException(`Série com ID "${id}" não encontrada para atualizar estoque.`);
        }
        serie.estoque = Math.max(0, serie.estoque - quantidade);
    }
};
exports.SeriesService = SeriesService;
exports.SeriesService = SeriesService = __decorate([
    (0, common_1.Injectable)()
], SeriesService);
//# sourceMappingURL=series.service.js.map