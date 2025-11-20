import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';
import { LoginUserDto } from './dto/loginUser';
import type { User } from './model/users.model';
export declare class UserService {
    private readonly jwtService;
    private readonly saltRounds;
    private users;
    constructor(jwtService: JwtService);
    private createToken;
    loginUser(data: LoginUserDto): Promise<{
        access_token: string;
    } | undefined>;
    addUser(data: CreateUserDto): Promise<{
        access_token: string;
    }>;
    updateUser(id: string, data: UpdateUserDto): Promise<string>;
    getAllUsers(): Omit<User, 'password'>[];
    findUserByEmail(email: string): User | undefined;
    findUserById(id: string): User | undefined;
    findUserSafeById(id: string): Omit<User, 'password'> | undefined;
    deleteUser(id: string): boolean;
}
