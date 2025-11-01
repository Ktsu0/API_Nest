"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const bancoUsers_1 = require("./model/bancoUsers");
let UserService = class UserService {
    users = [...bancoUsers_1.usuarios];
    getAllUsers() {
        return this.users;
    }
    findUserByEmail(email) {
        return this.users.find((u) => u.email === email);
    }
    findUserById(id) {
        return this.users.find((u) => u.id === id);
    }
    addUser(data) {
        const newUser = {
            id: (0, uuid_1.v4)(),
            email: data.email,
            password: data.password,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
        };
        this.users.push(newUser);
        return newUser;
    }
    updateUser(id, data) {
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }
        const updatedUser = {
            ...this.users[index],
            ...data,
            id: id,
        };
        this.users[index] = updatedUser;
        return updatedUser;
    }
    deleteUser(id) {
        const initialLength = this.users.length;
        this.users = this.users.filter((u) => u.id !== id);
        if (this.users.length === initialLength) {
            throw new common_1.NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }
        return true;
    }
    loginUser(data) {
        return this.users.find((u) => u.email === data.email && u.password === data.password);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=users.service.js.map