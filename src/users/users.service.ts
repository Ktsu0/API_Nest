import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';
import { LoginUserDto } from './dto/loginUser';
import type { User } from './model/users.model';
import { usuarios } from './model/bancoUsers';
import { Roles } from './model/roles.enum';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;
  private users: User[] = [...usuarios];

  constructor(private readonly jwtService: JwtService) {}

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
    const user = this.users.find((u) => u.email === data.email);

    if (!user) return undefined;

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) return undefined;

    return { access_token: this.createToken(user) };
  }

  // ----------------------------------------------------
  // CRIAR USUÁRIO
  // ----------------------------------------------------
  async addUser(data: CreateUserDto): Promise<{ access_token: string }> {
    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

    const role = data.email === 'teste1@gmail.com' ? Roles.ADMIN : Roles.USER;

    const newUser: User = {
      id: uuidv4(),
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

  // ----------------------------------------------------
  // ATUALIZAR USUÁRIO
  // ----------------------------------------------------
  async updateUser(id: string, data: UpdateUserDto): Promise<string> {
    const index = this.users.findIndex((u) => u.id === id);

    if (index === -1) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    let newPasswordHash: string | undefined;

    if (data.password) {
      newPasswordHash = await bcrypt.hash(data.password, this.saltRounds);
    }

    const updatedUser: User = {
      ...this.users[index],
      ...data,
      password: newPasswordHash || this.users[index].password,
    };

    this.users[index] = updatedUser;

    return this.createToken(updatedUser);
  }

  // ----------------------------------------------------
  // GET
  // ----------------------------------------------------
  getAllUsers(): Omit<User, 'password'>[] {
    return this.users.map(({ password, ...u }) => u);
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  findUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  findUserSafeById(id: string): Omit<User, 'password'> | undefined {
    const user = this.findUserById(id);
    if (!user) return undefined;

    const { password, ...safe } = user;
    return safe;
  }

  // ----------------------------------------------------
  // DELETE
  // ----------------------------------------------------
  deleteUser(id: string): boolean {
    const before = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);

    if (this.users.length === before) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return true;
  }
}
