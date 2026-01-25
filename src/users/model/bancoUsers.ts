import { Roles } from './roles.enum';
import { User } from './users.model';

export const usuarios: User[] = [
  {
    id: 'admin-id-fixed',
    email: 'teste1@gmail.com',
    password: '$2b$10$LmL0WfXtOOY1XC20l2WOBuZrkz1NCk1PMUAaAVKJmmH7EHNMrdF56', // Hash de 'gabi10' com bcryptjs
    firstName: 'Admin',
    lastName: 'Sistema',
    Cpf: '00000000000',
    telefone: '00000000000',
    cep: '00000-000',
    genero: 'Outro',
    nascimento: '2000-01-01',
    roles: [Roles.ADMIN],
  },
];
