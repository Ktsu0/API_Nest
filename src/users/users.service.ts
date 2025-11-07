import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';
import { LoginUserDto } from './dto/loginUser';
import type { User } from './model/users.model';
import { usuarios } from './model/bancoUsers';

// A interface AuthResponse foi removida, pois o retorno será apenas a string do token.

@Injectable()
export class UserService {
  private readonly saltRounds = 10;
  private users: User[] = [...usuarios];

  constructor(private readonly jwtService: JwtService) {}

  // ----------------------------------------------------
  // FUNÇÃO PRIVADA: Geração do Token JWT (Inalterada)
  // ----------------------------------------------------

  private createToken(user: User): string {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    return this.jwtService.sign(payload);
  }

  // ----------------------------------------------------
  // LOGIN - Retorna APENAS o Token ⬅️ MODIFICADO
  // ----------------------------------------------------

  async loginUser(data: LoginUserDto): Promise<string | undefined> {
    // ⬅️ Tipo de retorno alterado
    const user = this.users.find((u) => u.email === data.email);

    if (!user) {
      return undefined;
    }
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (isMatch) {
      // 1. Gera o token
      const token = this.createToken(user);

      // 2. Retorna APENAS o token
      return token;
    }

    return undefined;
  }

  // ----------------------------------------------------
  // POST (Criação) - Hashing da Senha E Retorna APENAS o Token ⬅️ MODIFICADO
  // ----------------------------------------------------

  async addUser(data: CreateUserDto): Promise<string> {
    // ⬅️ Tipo de retorno alterado
    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

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
    };
    this.users.push(newUser);

    // 1. Gera o token para o novo usuário
    const token = this.createToken(newUser);

    // 2. Retorna APENAS o token
    return token;
  }

  // ----------------------------------------------------
  // PUT (Atualização) - Retorna APENAS o Token ⬅️ MODIFICADO
  // ----------------------------------------------------

  async updateUser(id: string, data: UpdateUserDto): Promise<string> {
    // ⬅️ Tipo de retorno alterado
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
      id: id,
    };

    this.users[index] = updatedUser;

    // 1. Cria um novo token para o usuário atualizado
    const newToken = this.createToken(updatedUser);

    // 2. Retorna APENAS o novo token
    return newToken;
  }

  // ----------------------------------------------------
  // GET (Leitura) - Mantidos
  // ----------------------------------------------------

  getAllUsers(): Omit<User, 'password'>[] {
    return this.users.map(
      ({ password, ...user }) => user as Omit<User, 'password'>,
    );
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  findUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  findUserSafeById(id: string): Omit<User, 'password'> | undefined {
    const user = this.users.find((u) => u.id === id);
    if (!user) return undefined;
    const { password, ...safeUser } = user;
    return safeUser as Omit<User, 'password'>;
  }

  // ----------------------------------------------------
  // DELETE (Remoção) - Mantido
  // ----------------------------------------------------

  deleteUser(id: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);

    if (this.users.length === initialLength) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return true;
  }
}
