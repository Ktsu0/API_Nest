"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serie_module_1 = require("./cardsSerie/serie.module");
const app_controller_1 = require("./app.controller");
const users_module_1 = require("./users/users.module");
const carrinho_module_1 = require("./carrinho/carrinho.module");
const anime_module_1 = require("./cardsAnime/anime.module");
const prisma_service_1 = require("./prisma.service");
const serieFirebase_module_1 = require("./cardsSerieFireBase/serieFirebase.module");
const firebase_module_1 = require("./fireBase/firebase.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serie_module_1.SeriesModule,
            users_module_1.UserModule,
            carrinho_module_1.CarrinhoModule,
            anime_module_1.AnimeModule,
            serieFirebase_module_1.SerieFirebaseModule,
            firebase_module_1.FirebaseModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map