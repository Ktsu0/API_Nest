import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Roles } from 'src/users/model/roles.enum';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Comentário: verifica se rota exige roles e valida usuário
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log(`[RolesGuard] Rota exige: ${JSON.stringify(requiredRoles)}`);
    console.log(
      `[RolesGuard] Usuário: ${user?.email}, Roles: ${JSON.stringify(user?.roles)}`,
    );

    if (!user) throw new ForbiddenException('Usuário não autenticado');

    const hasPermission = requiredRoles.some((role) =>
      user.roles?.includes(role),
    );

    console.log(`[RolesGuard] Permissão concedida? ${hasPermission}`);

    if (!hasPermission)
      throw new ForbiddenException('Acesso negado: permissão insuficiente');

    return true;
  }
}
