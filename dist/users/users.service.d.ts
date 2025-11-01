import { CreateUserDto } from 'src/dto/users/createUser';
import { UpdateUserDto } from 'src/dto/users/updateUser';
import { LoginUserDto } from 'src/dto/users/loginUser';
import type { User } from './users.model';
export declare class UserService {
    private users;
    getAllUsers(): User[];
    findUserByEmail(email: string): User | undefined;
    findUserById(id: string): User | undefined;
    addUser(data: CreateUserDto): User;
    updateUser(id: string, data: UpdateUserDto): User;
    deleteUser(id: string): boolean;
    loginUser(data: LoginUserDto): User | undefined;
}
