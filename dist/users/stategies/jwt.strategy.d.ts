import { Strategy } from 'passport-jwt';
import { UserService } from '../users.service';
export interface JwtPayload {
    email: string;
    sub: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    constructor(userService: UserService);
    validate(payload: JwtPayload): Promise<Omit<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        roles: import("@prisma/client").$Enums.UserRole[];
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        Cpf: string;
        telefone: string;
        cep: string;
        genero: string;
        nascimento: string;
    }, "password">>;
}
export {};
