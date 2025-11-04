import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';
import { LoginUserDto } from './dto/loginUser';
import type { User } from './model/users.model';
import { usuarios } from './model/bancoUsers';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;
  private users: User[] = [...usuarios];

  // ----------------------------------------------------
  // GET (Leitura) - Sem alterações
  // ----------------------------------------------------

  getAllUsers(): User[] {
    return this.users.map(({ password, ...user }) => user as User);
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  findUserById(id: string): User | undefined {
    const user = this.users.find((u) => u.id === id);
    if (!user) return undefined;
    const { password, ...safeUser } = user;
    return safeUser as User;
  }

  // ----------------------------------------------------
  // POST (Criação) - Hashing da Senha
  // ----------------------------------------------------

  async addUser(data: CreateUserDto): Promise<User> {
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
    const { password, ...safeUser } = newUser;
    return safeUser as User;
  }

  // ----------------------------------------------------
  // PUT (Atualização) - Permite atualizar a senha com hash
  // ----------------------------------------------------

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
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
    const { password, ...safeUser } = updatedUser;
    return safeUser as User;
  }

  // ----------------------------------------------------
  // DELETE (Remoção) - Sem alterações
  // ----------------------------------------------------

  deleteUser(id: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);

    if (this.users.length === initialLength) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return true;
  }

  // ----------------------------------------------------
  // LOGIN - Comparação do Hash
  // ----------------------------------------------------

  async loginUser(data: LoginUserDto): Promise<User | undefined> {
    const user = this.users.find((u) => u.email === data.email);

    if (!user) {
      return undefined;
    }
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (isMatch) {
      const { password, ...safeUser } = user;
      return safeUser as User;
    }

    return undefined;
  }
}
