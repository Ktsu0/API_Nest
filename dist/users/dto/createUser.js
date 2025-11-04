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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
class CreateUserDto {
    email;
    password;
    firstName;
    lastName;
    Cpf;
    telefone;
    cep;
    genero;
    nascimento;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'O e-mail fornecido não é válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O e-mail é obrigatório para o registro.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'A senha deve ser um texto válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A senha é obrigatória.' }),
    (0, class_validator_1.MinLength)(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'O nome deve ser um texto válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O primeiro nome é obrigatório.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'O sobrenome deve ser um texto válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O sobrenome é obrigatório.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'O CPF deve ser um texto válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O CPF é obrigatório.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "Cpf", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'O telefone deve ser um texto válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O telefone é obrigatório.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "telefone", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'O CEP deve ser um texto válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O CEP é obrigatório.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "cep", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'O campo gênero deve ser um texto válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O gênero é obrigatório.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "genero", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'A data de nascimento deve ser um texto válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A data de nascimento é obrigatória.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "nascimento", void 0);
//# sourceMappingURL=createUser.js.map