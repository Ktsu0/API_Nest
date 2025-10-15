import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { User } from './users.model';

@Injectable()
export class UserService {
  private users: User[] = [];

  // Retorna todos os usuários
  getAllUsers(): User[] {
    return this.users;
  }

  // Adiciona um novo usuário
  addUser(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): User {
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

  // Busca um usuário pelo email
  findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  // Login do usuário
  loginUser(data: { email: string; password: string }): User | undefined {
    return this.users.find(
      (u) => u.email === data.email && u.password === data.password,
    );
  }
}
