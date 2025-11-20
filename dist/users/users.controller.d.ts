import type { Response } from 'express';
import { UserService } from './users.service';
import { LoginUserDto } from './dto/loginUser';
import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';
import type { User } from './model/users.model';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    addUser(res: Response, registerDto: CreateUserDto): Promise<{
        message: string;
    }>;
    login(res: Response, loginDto: LoginUserDto): Promise<{
        message: string;
    }>;
    getRole(req: any): {
        roles: any;
    };
    getUsers(): Omit<User, 'password'>[];
    getUserById(id: string): Omit<User, 'password'>;
    getProfile(req: any): Omit<User, 'password'>;
    updateUser(id: string, body: UpdateUserDto, req: any): Promise<string>;
    deleteUser(id: string, req: any): void;
}
