"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimeController = void 0;
const common_1 = require("@nestjs/common");
const anime_service_1 = require("./anime.service");
const createCard_1 = require("../dto/createCard");
let AnimeController = class AnimeController {
    animesService;
    constructor(animesService) {
        this.animesService = animesService;
    }
    findAll() {
        return this.animesService.findAll();
    }
    findOne(id) {
        return this.animesService.findOne(id);
    }
    findTema(tema) {
        return this.animesService.findTema(tema);
    }
    ordemAlfabetica() {
        return this.animesService.ordemAlfabetica();
    }
    findByTitle(q) {
        if (!q) {
            return this.animesService.findAll();
        }
        return this.animesService.findTitulo(q);
    }
    addAnime(anime) {
        return this.animesService.addAnime(anime);
    }
    addAvaliacao(id, avaliacao) {
        this.animesService.addAvaliacao(id, avaliacao);
        return `Avaliação de ${avaliacao} adicionada à série com ID ${id}.`;
    }
    updateAnime(id, updatedData) {
        const anime = this.animesService.updateAnime(id, updatedData);
        return anime;
    }
    deleteAnime(id) {
        return this.animesService.deleteAnime(id);
    }
};
exports.AnimeController = AnimeController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], AnimeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], AnimeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('tema/:tema'),
    __param(0, (0, common_1.Param)('tema')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], AnimeController.prototype, "findTema", null);
__decorate([
    (0, common_1.Get)('ordem/alfabetica'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], AnimeController.prototype, "ordemAlfabetica", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], AnimeController.prototype, "findByTitle", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createCard_1.CreateCard]),
    __metadata("design:returntype", Object)
], AnimeController.prototype, "addAnime", null);
__decorate([
    (0, common_1.Post)(':id/avaliacao'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('avaliacao')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", String)
], AnimeController.prototype, "addAvaliacao", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Object)
], AnimeController.prototype, "updateAnime", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], AnimeController.prototype, "deleteAnime", null);
exports.AnimeController = AnimeController = __decorate([
    (0, common_1.Controller)('animes'),
    __metadata("design:paramtypes", [anime_service_1.AnimeService])
], AnimeController);
//# sourceMappingURL=anime.controller.js.map