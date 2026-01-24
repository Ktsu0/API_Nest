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
        return texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }
    async findAll() {
        return this.prisma.serie.findMany({
            where: {
                tipo: client_1.ProdutoTipo.ANIME,
            },
            include: {
                meta: true,
            },
            orderBy: {
                titulo: 'asc',
            },
        });
    }
    async findOne(id) {
        const anime = await this.prisma.serie.findUnique({
            where: { id },
            include: {
                meta: true,
            },
        });
        if (!anime) {
            throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrada.`);
        }
        return anime;
    }
    async findTema(tema) {
        const temaBusca = this.normalize(tema);
        const animes = await this.prisma.serie.findMany({
            where: {
                meta: {
                    tema: {
                        contains: temaBusca,
                    },
                },
                tipo: client_1.ProdutoTipo.ANIME,
            },
            include: {
                meta: true,
            },
        });
        if (!animes.length) {
            throw new common_1.NotFoundException(`Anime com tema "${tema}" não encontrada.`);
        }
        return animes;
    }
    async findTitulo(searchTerm) {
        const termBusca = this.normalize(searchTerm);
        let animes = await this.prisma.serie.findMany({
            where: {
                titulo: {
                    contains: termBusca,
                    mode: 'insensitive',
                },
                tipo: client_1.ProdutoTipo.ANIME,
            },
            include: {
                meta: true,
            },
        });
        if (!animes.length && termBusca.length >= 3) {
            const todas = await this.prisma.serie.findMany({
                where: { tipo: client_1.ProdutoTipo.ANIME },
                include: { meta: true },
            });
            const MAX_DISTANCE = termBusca.length > 8 ? 2 : termBusca.length > 5 ? 1 : 0;
            animes = todas.filter((anime) => {
                const tituloAnime = this.normalize(anime.titulo);
                const distance = levenshtein.get(termBusca, tituloAnime);
                return distance <= MAX_DISTANCE;
            });
        }
        return animes;
    }
    async addAnime(data) {
        return this.prisma.$transaction(async (tx) => {
            return tx.serie.create({
                data: {
                    titulo: data.titulo,
                    detalhes: data.detalhes,
                    imagem: data.imagem,
                    estoque: data.estoque,
                    valorUnitario: data.valorUnitario,
                    avaliacao: data.avaliacao,
                    tipo: client_1.ProdutoTipo.ANIME,
                    meta: {
                        create: {
                            temporada: data.meta.temporada,
                            tema: this.normalize(data.meta.tema),
                        },
                    },
                },
                include: {
                    meta: true,
                },
            });
        });
    }
    async updateImage(id, novaImagem) {
        try {
            return await this.prisma.serie.update({
                where: { id },
                data: { imagem: novaImagem },
                include: { meta: true },
            });
        }
        catch {
            throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrada.`);
        }
    }
    async addAvaliacao(id, avaliacao) {
        try {
            return await this.prisma.serie.update({
                where: { id },
                data: { avaliacao },
            });
        }
        catch {
            throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrada.`);
        }
    }
    async updateAnime(id, updatedData) {
        try {
            return await this.prisma.serie.update({
                where: { id },
                data: {
                    titulo: updatedData.titulo,
                    detalhes: updatedData.detalhes,
                    imagem: updatedData.imagem,
                    estoque: updatedData.estoque,
                    valorUnitario: updatedData.valorUnitario,
                    avaliacao: updatedData.avaliacao,
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
                include: {
                    meta: true,
                },
            });
        }
        catch {
            throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrada.`);
        }
    }
    async deleteAnime(id) {
        try {
            await this.prisma.serie.delete({
                where: { id },
            });
            return `Anime removida com sucesso.`;
        }
        catch {
            throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrada.`);
        }
    }
    async atualizarEstoque(id, quantidade) {
        try {
            return await this.prisma.serie.update({
                where: { id },
                data: {
                    estoque: {
                        decrement: quantidade,
                    },
                },
            });
        }
        catch {
            throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrada para atualizar estoque.`);
        }
    }
    async ordemAlfabetica() {
        return this.prisma.serie.findMany({
            where: {
                tipo: client_1.ProdutoTipo.ANIME,
            },
            include: {
                meta: true,
            },
            orderBy: {
                titulo: 'asc',
            },
        });
    }
};
exports.AnimeService = AnimeService;
exports.AnimeService = AnimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnimeService);
//# sourceMappingURL=anime.service.js.map