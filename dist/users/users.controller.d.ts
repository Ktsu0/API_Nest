import type { Response } from 'express';
import { UserService } from './users.service';
import { LoginUserDto } from './dto/loginUser';
import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';
import { User } from '@prisma/client';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    addUser(req: any, res: Response, registerDto: CreateUserDto): Promise<{
        message: string;
    }>;
    login(req: any, res: Response, loginDto: LoginUserDto): Promise<{
        message: string;
    }>;
    logout(req: any, res: Response): Promise<{
        message: string;
    }>;
    getRole(req: any): {
        roles: any;
    };
    getUsers(): Promise<Omit<User, 'password'>[]>;
    getUserById(id: string): Promise<Omit<User, 'password'>>;
    getProfile(req: any): Omit<User, 'password'>;
    updateUser(id: string, body: UpdateUserDto, req: any): Promise<string>;
    deleteUser(id: string, req: any): Promise<void>;
}
