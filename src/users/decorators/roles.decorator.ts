import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/users/model/roles.enum';

export const ROLES_KEY = 'roles';
export const RolesG = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
