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
  UseGuards, // ⬅️ Novo Import
  Req, // ⬅️ Novo Import
  UnauthorizedException, // ⬅️ Novo Import
} from '@nestjs/common';
import { UserService } from './users.service';
import { LoginUserDto } from './dto/loginUser';
import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';
import type { User } from './model/users.model';

// Importe seu guard JWT
import { JwtAutGuard } from 'src/users/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ----------------------------------------------------
  // ROTAS PÚBLICAS: POST (Login e Criação/Registro)
  // ----------------------------------------------------

  @Post()
  async addUser(@Body() body: CreateUserDto): Promise<string> {
    // ⬅️ Retorna APENAS o Token
    const existingUser = this.userService.findUserByEmail(body.email);
    if (existingUser) {
      throw new BadRequestException('Usuário já registrado com este e-mail.');
    }
    // userService.addUser agora retorna o token (string)
    return await this.userService.addUser(body);
  }

  @Post('login')
  async loginUser(@Body() body: LoginUserDto): Promise<string> {
    // ⬅️ Retorna APENAS o Token
    // userService.loginUser agora retorna o token (string) ou undefined
    const token = await this.userService.loginUser(body);

    if (!token) {
      throw new BadRequestException('E-mail ou senha inválidos.');
    }
    return token;
  }

  // ----------------------------------------------------
  // ROTAS PROTEGIDAS (Exigem Token Válido)
  // ----------------------------------------------------

  @UseGuards(JwtAutGuard) // ⬅️ Protegido
  @Get()
  // Retorna uma lista de usuários, usando a versão segura do Service
  getUsers(): Omit<User, 'password'>[] {
    // Assumindo que getAllUsers foi ajustado para retornar Omit<User, 'password'>[]
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAutGuard) // ⬅️ Protegido
  @Get(':id')
  // Retorna um único usuário (versão segura)
  getUserById(@Param('id') id: string): Omit<User, 'password'> {
    // Usamos findUserSafeById para garantir que a senha não retorne
    const user = this.userService.findUserSafeById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return user;
  }

  // Rota para o próprio perfil (perfil logado)
  @UseGuards(JwtAutGuard)
  @Get('profile')
  // O token é validado, e o objeto do usuário (sem senha) é injetado em req.user pela JwtStrategy
  getProfile(@Req() req): Omit<User, 'password'> {
    return req.user;
  }

  // ----------------------------------------------------
  // PUT (Atualização) - Rota Protegida
  // ----------------------------------------------------

  @UseGuards(JwtAutGuard) // ⬅️ Protegido
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Req() req, // Para verificar se o usuário está atualizando o próprio perfil
  ): Promise<string> {
    // ⬅️ Retorna APENAS o Novo Token

    // ⚠️ Verificação de autorização: Permite que o usuário só atualize o próprio perfil
    if (req.user.id !== id) {
      throw new UnauthorizedException(
        'Você não tem permissão para atualizar este perfil.',
      );
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
    // userService.updateUser agora retorna o token (string)
    return await this.userService.updateUser(id, body);
  }

  // ----------------------------------------------------
  // DELETE (Remoção) - Rota Protegida
  // ----------------------------------------------------

  @UseGuards(JwtAutGuard) // ⬅️ Protegido
  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id') id: string, @Req() req): void {
    // ⚠️ Verificação de autorização: Permite que o usuário só delete o próprio perfil
    if (req.user.id !== id) {
      throw new UnauthorizedException(
        'Você não tem permissão para deletar este perfil.',
      );
    }

    this.userService.deleteUser(id);
  }
}
