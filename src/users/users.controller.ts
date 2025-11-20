import {
  Req,
  Res,
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  Request,
  HttpCode,
  UseGuards,
  Controller,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { UserService } from './users.service';
import { LoginUserDto } from './dto/loginUser';
import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';
import type { User } from './model/users.model';
import { JwtAutGuard } from 'src/users/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ----------------------------------------------------
  // ROTAS PÚBLICAS: POST (Login e Criação/Registro)
  // ----------------------------------------------------

  @Post()
  async addUser(
    @Res({ passthrough: true }) res: Response,
    @Body() registerDto: CreateUserDto,
  ) {
    const { access_token } = await this.userService.addUser(registerDto);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 1,
    });

    return { message: 'Registro bem-sucedido' };
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginUserDto,
  ) {
    const result = await this.userService.loginUser(loginDto);

    if (!result) {
      throw new BadRequestException('E-mail ou senha inválidos.');
    }

    const { access_token } = result;

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === 'production'
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 1,
    });

    return { message: 'Login bem-sucedido' };
  }

  // ----------------------------------------------------
  // ROTAS PROTEGIDAS (Exigem Token Válido)
  // ----------------------------------------------------

  @UseGuards(JwtAutGuard)
  @Get('role')
  getRole(@Request() req) {
    return { roles: req.user.roles };
  }

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
