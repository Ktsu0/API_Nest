"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesG = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ROLES_KEY = 'roles';
const RolesG = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.RolesG = RolesG;
//# sourceMappingURL=roles.decorator.js.map