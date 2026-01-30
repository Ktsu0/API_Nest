import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';
import { LoginUserDto } from './dto/loginUser';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
export declare class UserService {
    private readonly jwtService;
    private readonly prisma;
    private readonly saltRounds;
    constructor(jwtService: JwtService, prisma: PrismaService);
    private createToken;
    loginUser(data: LoginUserDto): Promise<{
        access_token: string;
    } | undefined>;
    addUser(data: CreateUserDto): Promise<{
        access_token: string;
    }>;
    updateUser(id: string, data: UpdateUserDto): Promise<string>;
    getAllUsers(): Promise<Omit<User, 'password'>[]>;
    findUserByEmail(email: string): Promise<User | null>;
    findUserById(id: string): Promise<User | null>;
    findUserSafeById(id: string): Promise<Omit<User, 'password'> | null>;
    deleteUser(id: string): Promise<void>;
}
