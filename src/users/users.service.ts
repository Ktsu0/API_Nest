// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
// 💡 Importe os DTOs, ajustando o caminho conforme sua estrutura
import { CreateUserDto } from 'src/dto/users/createUser'; // DTO de Criação
import { UpdateUserDto } from 'src/dto/users/updateUser'; // DTO de Atualização
import { LoginUserDto } from 'src/dto/users/loginUser'; // DTO de Login

import type { User } from './users.model';
import { usuarios } from './model/bancoUsers';

@Injectable()
export class UserService {
  private users: User[] = [...usuarios];

  // ----------------------------------------------------
  // GET (Leitura)
  // ----------------------------------------------------

  getAllUsers(): User[] {
    return this.users;
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  findUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  // ----------------------------------------------------
  // POST (Criação)
  // ----------------------------------------------------

  // 💡 USANDO CreateUserDto
  addUser(data: CreateUserDto): User {
    const newUser: User = {
      id: uuidv4(),
      email: data.email,
      password: data.password,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
    };
    this.users.push(newUser);
    return newUser;
  }

  // ----------------------------------------------------
  // PUT (Atualização)
  // ----------------------------------------------------

  // 💡 USANDO UpdateUserDto
  updateUser(id: string, data: UpdateUserDto): User {
    const index = this.users.findIndex((u) => u.id === id);

    if (index === -1) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    const updatedUser: User = {
      ...this.users[index],
      ...data, // O DTO garante que só campos existentes sejam passados
      id: id,
    };

    this.users[index] = updatedUser;
    return updatedUser;
  }

  // ----------------------------------------------------
  // DELETE (Remoção)
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
  // LOGIN
  // ----------------------------------------------------

  // 💡 USANDO LoginUserDto
  loginUser(data: LoginUserDto): User | undefined {
    return this.users.find(
      (u) => u.email === data.email && u.password === data.password,
    );
  }
}
