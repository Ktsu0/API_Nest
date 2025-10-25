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
exports.SeriesController = void 0;
const common_1 = require("@nestjs/common");
const series_service_1 = require("./series.service");
const createCard_1 = require("../dto/cards/createCard");
const avaliacao_1 = require("../dto/cards/avaliacao");
const updateCard_1 = require("../dto/cards/updateCard");
const idParam_1 = require("../dto/cards/idParam");
const temaParam_1 = require("../dto/cards/temaParam");
let SeriesController = class SeriesController {
    seriesService;
    constructor(seriesService) {
        this.seriesService = seriesService;
    }
    findAll() {
        return this.seriesService.findAll();
    }
    findOne(params) {
        return this.seriesService.findOne(params.id);
    }
    findTema(params) {
        return this.seriesService.findTema(params.tema);
    }
    ordemAlfabetica() {
        return this.seriesService.ordemAlfabetica();
    }
    findByTitle(q) {
        if (!q) {
            return this.seriesService.findAll();
        }
        return this.seriesService.findTitulo(q);
    }
    addSerie(serie) {
        return this.seriesService.addSerie(serie);
    }
    addAvaliacao(id, avaliacaoDTO) {
        this.seriesService.addAvaliacao(id, avaliacaoDTO.avaliacao);
        return `Avaliação de ${avaliacaoDTO.avaliacao} adicionada à série com ID ${id}.`;
    }
    updateSerie(id, updatedData) {
        const serie = this.seriesService.updateSerie(id, updatedData);
        return serie;
    }
    deleteSerie(params) {
        return this.seriesService.deleteSerie(params.id);
    }
};
exports.SeriesController = SeriesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], SeriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [idParam_1.IdParamDto]),
    __metadata("design:returntype", Object)
], SeriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('tema/:tema'),
    __param(0, (0, common_1.Param)('tema')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [temaParam_1.TemaParamDto]),
    __metadata("design:returntype", Array)
], SeriesController.prototype, "findTema", null);
__decorate([
    (0, common_1.Get)('ordem/alfabetica'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], SeriesController.prototype, "ordemAlfabetica", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], SeriesController.prototype, "findByTitle", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createCard_1.CreateCard]),
    __metadata("design:returntype", Object)
], SeriesController.prototype, "addSerie", null);
__decorate([
    (0, common_1.Post)(':id/avaliacao'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('avaliacao')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, avaliacao_1.AvaliacaoDTO]),
    __metadata("design:returntype", String)
], SeriesController.prototype, "addAvaliacao", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateCard_1.UpdateCardDto]),
    __metadata("design:returntype", Object)
], SeriesController.prototype, "updateSerie", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [idParam_1.IdParamDto]),
    __metadata("design:returntype", String)
], SeriesController.prototype, "deleteSerie", null);
exports.SeriesController = SeriesController = __decorate([
    (0, common_1.Controller)('series'),
    __metadata("design:paramtypes", [series_service_1.SeriesService])
], SeriesController);
//# sourceMappingURL=series.controller.js.map