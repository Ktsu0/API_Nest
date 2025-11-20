import { Roles } from './roles.enum';
export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    Cpf: string;
    telefone: string;
    cep: string;
    genero: string;
    nascimento: string;
    roles: [Roles];
}
