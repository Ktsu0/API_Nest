import { UserService } from './users.service';
import { LoginUserDto } from './dto/loginUser';
import { CreateUserDto } from './dto/createUser';
import { UpdateUserDto } from './dto/updateUser';
import type { User } from './model/users.model';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUsers(): User[];
    getUserById(id: string): User;
    addUser(body: CreateUserDto): Promise<User>;
    loginUser(body: LoginUserDto): Promise<User>;
    updateUser(id: string, body: UpdateUserDto): Promise<User>;
    deleteUser(id: string): void;
}
