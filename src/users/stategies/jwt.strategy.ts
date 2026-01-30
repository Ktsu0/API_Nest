// src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../users.service';
import { Request } from 'express';

// O payload do token, que definimos na função createToken
export interface JwtPayload {
  email: string;
  sub: string; // ID do usuário
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      // 🚨 MUDANÇA CRÍTICA: Altera a fonte de extração do token
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 💡 Novo Extrator customizado para buscar o token no cookie
        (req: Request) => {
          if (req.cookies && req.cookies.access_token) {
            return req.cookies.access_token;
          }
          return null;
        },
        // Mantém o Bearer Token como fallback (opcional, mas recomendado)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey:
        'MKSDNG1519782DSAFDHSDG5S4F56AF5D1G56FD1H2B1FD894GFB21VC3848FSA7E8W9QE7J7U98JKLI98L7UI45J61S25DA9AD78DSAF1D3H51FD7H8F4JHGF123XCVXVKLSADQWIUEETSKMCXZ8972131S56D4GJJHKLIUOUITYWEEQISKLAMD',
    });
  }

  async validate(payload: JwtPayload) {
    // Busca o usuário pelo ID contido no token (payload.sub)
    const user = await this.userService.findUserSafeById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(
        'Token inválido ou usuário não encontrado.',
      );
    }

    // Retorna o objeto do usuário (sem a senha) para ser injetado em @Req() ou @User()
    return user;
  }
}
