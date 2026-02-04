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
exports.SerieFirebaseController = void 0;
const common_1 = require("@nestjs/common");
const serieFirebase_service_1 = require("./serieFirebase.service");
const createCard_1 = require("../dtoCardsFireBase/createCard");
const updateCard_1 = require("../dtoCardsFireBase/updateCard");
const idParam_1 = require("../dtoCardsFireBase/idParam");
const temaParam_1 = require("../dtoCardsFireBase/temaParam");
const jwt_auth_guard_1 = require("../users/guards/jwt-auth.guard");
const roles_guard_1 = require("../users/guards/roles.guard");
const roles_enum_1 = require("../users/model/roles.enum");
const roles_decorator_1 = require("../users/decorators/roles.decorator");
let SerieFirebaseController = class SerieFirebaseController {
    serieService;
    constructor(serieService) {
        this.serieService = serieService;
    }
    async findAll() {
        return this.serieService.findAll();
    }
    async findTema(params) {
        return this.serieService.findTema(params.tema);
    }
    async ordemAlfabetica() {
        return this.serieService.ordemAlfabetica();
    }
    async findByTitle(q) {
        if (!q) {
            return this.serieService.findAll();
        }
        return this.serieService.findTitulo(q);
    }
    async findOne(params) {
        return this.serieService.findOne(params.id);
    }
    addSerie(req, serie) {
        console.log('[SerieFirebaseController] Adicionando série:', JSON.stringify(serie));
        console.log('[SerieFirebaseController] Por usuário:', req.user?.email);
        return this.serieService.addSerie(serie);
    }
    async addAvaliacao(id, avaliacao) {
        await this.serieService.addAvaliacao(id, avaliacao);
        return `Avaliação de ${avaliacao} adicionada à série com ID ${id}.`;
    }
    async updateSerie(id, updatedData) {
        return this.serieService.updateSerie(id, updatedData);
    }
    async deleteSerie(params) {
        return this.serieService.deleteSerie(params.id);
    }
};
exports.SerieFirebaseController = SerieFirebaseController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SerieFirebaseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tema/:tema'),
    __param(0, (0, common_1.Param)('tema')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [temaParam_1.TemaParamDto]),
    __metadata("design:returntype", Promise)
], SerieFirebaseController.prototype, "findTema", null);
__decorate([
    (0, common_1.Get)('ordem/alfabetica'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SerieFirebaseController.prototype, "ordemAlfabetica", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SerieFirebaseController.prototype, "findByTitle", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [idParam_1.IdParamDto]),
    __metadata("design:returntype", Promise)
], SerieFirebaseController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAutGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesG)(roles_enum_1.Roles.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, createCard_1.CreateCard]),
    __metadata("design:returntype", Promise)
], SerieFirebaseController.prototype, "addSerie", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAutGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)(':id/avaliacao'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('avaliacao')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], SerieFirebaseController.prototype, "addAvaliacao", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAutGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesG)(roles_enum_1.Roles.ADMIN),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateCard_1.UpdateCardDto]),
    __metadata("design:returntype", Promise)
], SerieFirebaseController.prototype, "updateSerie", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAutGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesG)(roles_enum_1.Roles.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [idParam_1.IdParamDto]),
    __metadata("design:returntype", Promise)
], SerieFirebaseController.prototype, "deleteSerie", null);
exports.SerieFirebaseController = SerieFirebaseController = __decorate([
    (0, common_1.Controller)('serieFirebase'),
    __metadata("design:paramtypes", [serieFirebase_service_1.SerieFirebaseService])
], SerieFirebaseController);
//# sourceMappingURL=serieFirebase.controller.js.map