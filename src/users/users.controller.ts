// src/users/users.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  BadRequestException,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { LoginUserDto } from 'src/dto/users/loginUser';
import { CreateUserDto } from 'src/dto/users/createUser';
import { UpdateUserDto } from 'src/dto/users/updateUser';
import type { User } from './users.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ----------------------------------------------------
  // GET (Leitura)
  // ----------------------------------------------------

  @Get()
  getUsers(): User[] {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string): User {
    const user = this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return user;
  }

  // ----------------------------------------------------
  // POST (Criação e Login)
  // ----------------------------------------------------

  @Post()
  addUser(@Body() body: CreateUserDto): User {
    const existingUser = this.userService.findUserByEmail(body.email);
    if (existingUser) {
      throw new BadRequestException('Usuário já registrado com este e-mail.');
    }
    return this.userService.addUser(body);
  }
  @Post('login')
  loginUser(@Body() body: LoginUserDto): User {
    const user = this.userService.loginUser(body);
    if (!user) {
      throw new BadRequestException('E-mail ou senha inválidos.');
    }
    return user;
  }

  // ----------------------------------------------------
  // PUT (Atualização)
  // ----------------------------------------------------

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto): User {
    if (!this.userService.findUserById(id)) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    if (body.email) {
      const existingUser = this.userService.findUserByEmail(body.email);
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException(
          'Este e-mail já está em uso por outro usuário.',
        );
      }
    }

    // 3. Executa a atualização
    return this.userService.updateUser(id, body);
  }

  // ----------------------------------------------------
  // DELETE (Remoção)
  // ----------------------------------------------------

  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id') id: string): void {
    this.userService.deleteUser(id);
  }
}
