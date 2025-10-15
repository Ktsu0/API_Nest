import type { User } from './users.model';
export declare class UserService {
    private users;
    getAllUsers(): User[];
    addUser(data: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
    }): User;
    findUserByEmail(email: string): User | undefined;
    loginUser(data: {
        email: string;
        password: string;
    }): User | undefined;
}
