import { UserService } from './users.service';
import type { User } from './users.model';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUsers(): User[];
    addUser(body: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
    }): User;
    loginUser(body: {
        email: string;
        password: string;
    }): User;
}
