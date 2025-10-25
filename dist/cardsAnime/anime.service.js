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
exports.AnimeService = void 0;
const common_1 = require("@nestjs/common");
const levenshtein = __importStar(require("fast-levenshtein"));
const bancoDadosA_1 = require("./models/bancoDadosA");
let AnimeService = class AnimeService {
    Animes = bancoDadosA_1.topAnimes;
    findAll() {
        return this.Animes;
    }
    findOne(id) {
        const AnimeEncontrada = this.Animes.find((Anime) => Anime.id === id);
        if (!AnimeEncontrada) {
            throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrada.`);
        }
        return AnimeEncontrada;
    }
    findTema(tema) {
        const temaBusca = this.normalize(tema);
        const AnimesFiltradas = this.Animes.filter((Anime) => {
            const temaAnime = this.normalize(Anime.descricao.tema);
            return temaAnime.includes(temaBusca);
        });
        if (AnimesFiltradas.length === 0) {
            throw new common_1.NotFoundException(`Anime com tema "${tema}" não encontrada.`);
        }
        return AnimesFiltradas;
    }
    normalize(texto) {
        return texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }
    addAnime(Anime) {
        const novoId = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
        const novaAnime = { ...Anime, id: novoId };
        this.Animes.push(novaAnime);
        return novaAnime;
    }
    updateImage(id, novaImagem) {
        const AnimeEncontrada = this.Animes.find((Anime) => Anime.id === id);
        if (!AnimeEncontrada) {
            throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrada.`);
        }
        AnimeEncontrada.imagem = novaImagem;
        return AnimeEncontrada;
    }
    ordemAlfabetica() {
        const AnimesCopia = [...this.Animes];
        AnimesCopia.sort((a, b) => a.titulo.localeCompare(b.titulo));
        return AnimesCopia;
    }
    addAvaliacao(id, avaliacao) {
        const Anime = this.Animes.find((s) => s.id === id);
        if (!Anime) {
            throw new common_1.NotFoundException(`Série com ID "${id}" não encontrada.`);
        }
        Anime.avaliacao = avaliacao;
    }
    findTitulo(searchTerm) {
        const termBusca = this.normalize(searchTerm);
        let AnimesFiltradas = this.Animes.filter((Anime) => {
            const tituloAnime = this.normalize(Anime.titulo);
            return tituloAnime.includes(termBusca);
        });
        if (AnimesFiltradas.length === 0 && termBusca.length >= 3) {
            const MAX_DISTANCE = termBusca.length > 8 ? 2 : termBusca.length > 5 ? 1 : 0;
            AnimesFiltradas = this.Animes.filter((Anime) => {
                const tituloAnime = this.normalize(Anime.titulo);
                const distance = levenshtein.get(termBusca, tituloAnime);
                return distance <= MAX_DISTANCE;
            });
        }
        return AnimesFiltradas;
    }
    updateAnime(id, updatedData) {
        const index = this.Animes.findIndex((Anime) => Anime.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrada.`);
        }
        const current = this.Animes[index];
        this.Animes[index] = {
            ...current,
            ...updatedData,
            descricao: {
                ...current.descricao,
                ...(updatedData.descricao || {}),
            },
        };
        return this.Animes[index];
    }
    deleteAnime(id) {
        const index = this.Animes.findIndex((Anime) => Anime.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrada.`);
        }
        const titulo = this.Animes[index].titulo;
        this.Animes.splice(index, 1);
        return `Anime "${titulo}" removida com sucesso.`;
    }
    atualizarEstoque(id, quantidade) {
        const Anime = this.Animes.find((s) => s.id === id);
        if (!Anime) {
            throw new common_1.NotFoundException(`Anime com ID "${id}" não encontrada para atualizar estoque.`);
        }
        Anime.estoque = Math.max(0, Anime.estoque - quantidade);
    }
};
exports.AnimeService = AnimeService;
exports.AnimeService = AnimeService = __decorate([
    (0, common_1.Injectable)()
], AnimeService);
//# sourceMappingURL=anime.service.js.map