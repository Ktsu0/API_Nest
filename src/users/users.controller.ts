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
import { LoginUserDto } from './dto/loginUser';
import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';
import type { User } from './model/users.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ----------------------------------------------------
  // GET (Leitura) - Métodos Síncronos
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
  // POST (Criação e Login) - Métodos Assíncronos
  // ----------------------------------------------------

  @Post()
  async addUser(@Body() body: CreateUserDto): Promise<User> {
    const existingUser = this.userService.findUserByEmail(body.email);
    if (existingUser) {
      throw new BadRequestException('Usuário já registrado com este e-mail.');
    }
    return await this.userService.addUser(body);
  }

  @Post('login')
  async loginUser(@Body() body: LoginUserDto): Promise<User> {
    const user = await this.userService.loginUser(body);
    if (!user) {
      throw new BadRequestException('E-mail ou senha inválidos.');
    }
    return user;
  }

  // ----------------------------------------------------
  // PUT (Atualização) - Método Assíncrono
  // ----------------------------------------------------

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    if (!this.userService.findUserById(id)) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    // Verifica a disponibilidade do novo e-mail (se fornecido)
    if (body.email) {
      const existingUser = this.userService.findUserByEmail(body.email);
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException(
          'Este e-mail já está em uso por outro usuário.',
        );
      }
    }
    return await this.userService.updateUser(id, body);
  }

  // ----------------------------------------------------
  // DELETE (Remoção) - Método Síncrono
  // ----------------------------------------------------

  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id') id: string): void {
    // Assumindo que deleteUser é síncrono
    this.userService.deleteUser(id);
  }
}
