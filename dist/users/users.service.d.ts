import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';
import { LoginUserDto } from './dto/loginUser';
import type { User } from './model/users.model';
export declare class UserService {
    private readonly saltRounds;
    private users;
    getAllUsers(): User[];
    findUserByEmail(email: string): User | undefined;
    findUserById(id: string): User | undefined;
    addUser(data: CreateUserDto): Promise<User>;
    updateUser(id: string, data: UpdateUserDto): Promise<User>;
    deleteUser(id: string): boolean;
    loginUser(data: LoginUserDto): Promise<User | undefined>;
}
