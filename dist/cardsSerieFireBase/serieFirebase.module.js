"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerieFirebaseModule = void 0;
const common_1 = require("@nestjs/common");
const serieFirebase_controller_1 = require("./serieFirebase.controller");
const serieFirebase_service_1 = require("./serieFirebase.service");
let SerieFirebaseModule = class SerieFirebaseModule {
};
exports.SerieFirebaseModule = SerieFirebaseModule;
exports.SerieFirebaseModule = SerieFirebaseModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [serieFirebase_controller_1.SerieFirebaseController],
        providers: [serieFirebase_service_1.SerieFirebaseService],
        exports: [serieFirebase_service_1.SerieFirebaseService],
    })
], SerieFirebaseModule);
//# sourceMappingURL=serieFirebase.module.js.map