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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const loginUser_1 = require("./dto/loginUser");
const createUser_1 = require("./dto/createUser");
const updateUser_1 = require("./dto/updateUser");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async addUser(body) {
        const existingUser = this.userService.findUserByEmail(body.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Usuário já registrado com este e-mail.');
        }
        return await this.userService.addUser(body);
    }
    async loginUser(body) {
        const token = await this.userService.loginUser(body);
        if (!token) {
            throw new common_1.BadRequestException('E-mail ou senha inválidos.');
        }
        return token;
    }
    getUsers() {
        return this.userService.getAllUsers();
    }
    getUserById(id) {
        const user = this.userService.findUserSafeById(id);
        if (!user) {
            throw new common_1.NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }
        return user;
    }
    getProfile(req) {
        return req.user;
    }
    async updateUser(id, body, req) {
        if (req.user.id !== id) {
            throw new common_1.UnauthorizedException('Você não tem permissão para atualizar este perfil.');
        }
        if (body.email) {
            const existingUser = this.userService.findUserByEmail(body.email);
            if (existingUser && existingUser.id !== id) {
                throw new common_1.BadRequestException('Este e-mail já está em uso por outro usuário.');
            }
        }
        return await this.userService.updateUser(id, body);
    }
    deleteUser(id, req) {
        if (req.user.id !== id) {
            throw new common_1.UnauthorizedException('Você não tem permissão para deletar este perfil.');
        }
        this.userService.deleteUser(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addUser", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginUser_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAutGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAutGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAutGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAutGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateUser_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAutGuard),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UserService])
], UserController);
//# sourceMappingURL=users.controller.js.map