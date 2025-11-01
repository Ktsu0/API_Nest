import { UserService } from './users.service';
import { LoginUserDto } from 'src/dto/users/loginUser';
import { CreateUserDto } from 'src/dto/users/createUser';
import { UpdateUserDto } from 'src/dto/users/updateUser';
import type { User } from './users.model';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUsers(): User[];
    getUserById(id: string): User;
    addUser(body: CreateUserDto): User;
    loginUser(body: LoginUserDto): User;
    updateUser(id: string, body: UpdateUserDto): User;
    deleteUser(id: string): void;
}
