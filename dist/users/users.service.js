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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const uuid_1 = require("uuid");
const bcrypt = __importStar(require("bcryptjs"));
const bancoUsers_1 = require("./model/bancoUsers");
const roles_enum_1 = require("./model/roles.enum");
let UserService = class UserService {
    jwtService;
    saltRounds = 10;
    users = [...bancoUsers_1.usuarios];
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    createToken(user) {
        const payload = {
            email: user.email,
            sub: user.id,
            roles: user.roles,
        };
        return this.jwtService.sign(payload);
    }
    async loginUser(data) {
        const user = this.users.find((u) => u.email === data.email);
        if (!user)
            return undefined;
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch)
            return undefined;
        return { access_token: this.createToken(user) };
    }
    async addUser(data) {
        const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);
        const role = data.email === 'teste1@gmail.com' ? roles_enum_1.Roles.ADMIN : roles_enum_1.Roles.USER;
        const newUser = {
            id: (0, uuid_1.v4)(),
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            Cpf: data.Cpf || '',
            telefone: data.telefone || '',
            cep: data.cep || '',
            genero: data.genero || '',
            nascimento: data.nascimento || '',
            roles: [role],
        };
        this.users.push(newUser);
        return { access_token: this.createToken(newUser) };
    }
    async updateUser(id, data) {
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }
        let newPasswordHash;
        if (data.password) {
            newPasswordHash = await bcrypt.hash(data.password, this.saltRounds);
        }
        const updatedUser = {
            ...this.users[index],
            ...data,
            password: newPasswordHash || this.users[index].password,
        };
        this.users[index] = updatedUser;
        return this.createToken(updatedUser);
    }
    getAllUsers() {
        return this.users.map(({ password, ...u }) => u);
    }
    findUserByEmail(email) {
        return this.users.find((u) => u.email === email);
    }
    findUserById(id) {
        return this.users.find((u) => u.id === id);
    }
    findUserSafeById(id) {
        const user = this.findUserById(id);
        if (!user)
            return undefined;
        const { password, ...safe } = user;
        return safe;
    }
    deleteUser(id) {
        const before = this.users.length;
        this.users = this.users.filter((u) => u.id !== id);
        if (this.users.length === before) {
            throw new common_1.NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }
        return true;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], UserService);
//# sourceMappingURL=users.service.js.map