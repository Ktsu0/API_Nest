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
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let UserService = class UserService {
    jwtService;
    prisma;
    saltRounds = 10;
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
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
        const user = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user)
            return undefined;
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch)
            return undefined;
        return { access_token: this.createToken(user) };
    }
    async addUser(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('E-mail já cadastrado.');
        }
        const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);
        const role = data.email === 'teste1@gmail.com' ? client_1.UserRole.ADMIN : client_1.UserRole.USUARIO;
        const newUser = await this.prisma.user.create({
            data: {
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
            },
        });
        return { access_token: this.createToken(newUser) };
    }
    async updateUser(id, data) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }
        let newPasswordHash;
        if (data.password) {
            newPasswordHash = await bcrypt.hash(data.password, this.saltRounds);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                ...data,
                password: newPasswordHash,
            },
        });
        const updateData = { ...data };
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, this.saltRounds);
        }
        const finalUpdatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });
        return this.createToken(finalUpdatedUser);
    }
    async getAllUsers() {
        const users = await this.prisma.user.findMany();
        return users.map(({ password, ...u }) => u);
    }
    async findUserByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async findUserById(id) {
        return this.prisma.user.findUnique({ where: { id } });
    }
    async findUserSafeById(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            return null;
        const { password, ...safe } = user;
        return safe;
    }
    async deleteUser(id) {
        try {
            await this.prisma.user.delete({ where: { id } });
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException(`Usuário com ID ${id} não encontrado.`);
            }
            throw error;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=users.service.js.map