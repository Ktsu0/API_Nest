import { Strategy } from 'passport-jwt';
import { UserService } from 'src/users/users.service';
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
    validate(payload: JwtPayload): Promise<Omit<import("../model/users.model").User, "password">>;
}
export {};
