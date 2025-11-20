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

    if (!user) throw new ForbiddenException('Usuário não autenticado');

    const hasPermission = requiredRoles.some((role) =>
      user.roles?.includes(role),
    );

    if (!hasPermission)
      throw new ForbiddenException('Acesso negado: permissão insuficiente');

    return true;
  }
}
