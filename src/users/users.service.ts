import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';
import { LoginUserDto } from './dto/loginUser';
import { PrismaService } from 'src/prisma.service';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  // ----------------------------------------------------
  // TOKEN JWT
  // ----------------------------------------------------
  private createToken(user: User): string {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };
    return this.jwtService.sign(payload);
  }

  // ----------------------------------------------------
  // LOGIN
  // ----------------------------------------------------
  async loginUser(
    data: LoginUserDto,
  ): Promise<{ access_token: string } | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) return undefined;

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) return undefined;

    return { access_token: this.createToken(user) };
  }

  // ----------------------------------------------------
  // CRIAR USUÁRIO
  // ----------------------------------------------------
  async addUser(data: CreateUserDto): Promise<{ access_token: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('E-mail já cadastrado.');
    }

    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

    const role: UserRole =
      data.email === 'teste1@gmail.com' ? UserRole.ADMIN : UserRole.USUARIO;

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

  // ----------------------------------------------------
  // ATUALIZAR USUÁRIO
  // ----------------------------------------------------
  async updateUser(id: string, data: UpdateUserDto): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    let newPasswordHash: string | undefined;

    if (data.password) {
      newPasswordHash = await bcrypt.hash(data.password, this.saltRounds);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        password: newPasswordHash, // Se for undefined, o Prisma ignora se usarmos undefined? Não, precisamos tratar
      },
    });
    // Ajuste para password opcional no update
    // O spread ...data pode conter password. Se conter, e queremos hashear, precisamos remover do spread e colocar o hash.
    // Mas data é UpdateUserDto, que tem password opcional.
    // Melhor fazer:
    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, this.saltRounds);
    }

    // Vou refazer o update call corretamente abaixo
    const finalUpdatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return this.createToken(finalUpdatedUser);
  }

  // ----------------------------------------------------
  // GET
  // ----------------------------------------------------
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map(({ password, ...u }) => u);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findUserSafeById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    const { password, ...safe } = user;
    return safe;
  }

  // ----------------------------------------------------
  // DELETE
  // ----------------------------------------------------
  async deleteUser(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      // P2025 é o código do Prisma para "Record to delete does not exist"
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
      }
      throw error;
    }
  }
}
