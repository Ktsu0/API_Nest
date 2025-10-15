// src/users/users.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './users.service';
import type { User } from './users.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET - listar todos os usuários
  @Get()
  getUsers(): User[] {
    return this.userService.getAllUsers();
  }

  // POST - registrar usuário
  @Post()
  addUser(
    @Body()
    body: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    },
  ): User {
    // Checa se o usuário já existe
    const existingUser = this.userService.findUserByEmail(body.email);
    if (existingUser) {
      throw new BadRequestException('Usuário já registrado com este e-mail.');
    }
    return this.userService.addUser(body);
  }

  // POST - login
  @Post('login')
  loginUser(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ): User {
    const user = this.userService.loginUser(body);
    if (!user) {
      throw new BadRequestException('E-mail ou senha inválidos.');
    }
    return user;
  }
}
