"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarrinhoModule = void 0;
const common_1 = require("@nestjs/common");
const carrinho_controller_1 = require("./carrinho.controller");
const carrinho_service_1 = require("./carrinho.service");
const serie_module_1 = require("../cardsSerie/serie.module");
const anime_module_1 = require("../cardsAnime/anime.module");
const prisma_service_1 = require("../prisma.service");
let CarrinhoModule = class CarrinhoModule {
};
exports.CarrinhoModule = CarrinhoModule;
exports.CarrinhoModule = CarrinhoModule = __decorate([
    (0, common_1.Module)({
        imports: [anime_module_1.AnimeModule, serie_module_1.SeriesModule],
        controllers: [carrinho_controller_1.CarrinhoController],
        providers: [carrinho_service_1.CarrinhoService, prisma_service_1.PrismaService],
    })
], CarrinhoModule);
//# sourceMappingURL=carrinho.module.js.map