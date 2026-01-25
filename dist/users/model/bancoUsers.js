"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarios = void 0;
const roles_enum_1 = require("./roles.enum");
exports.usuarios = [
    {
        id: 'admin-id-fixed',
        email: 'teste1@gmail.com',
        password: '$2b$10$LmL0WfXtOOY1XC20l2WOBuZrkz1NCk1PMUAaAVKJmmH7EHNMrdF56',
        firstName: 'Admin',
        lastName: 'Sistema',
        Cpf: '00000000000',
        telefone: '00000000000',
        cep: '00000-000',
        genero: 'Outro',
        nascimento: '2000-01-01',
        roles: [roles_enum_1.Roles.ADMIN],
    },
];
//# sourceMappingURL=bancoUsers.js.map