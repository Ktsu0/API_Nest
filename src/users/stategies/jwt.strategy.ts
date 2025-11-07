// src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/users/users.service'; // Ajuste o caminho conforme sua estrutura

// O payload do token, que definimos na função createToken
export interface JwtPayload {
  email: string;
  sub: string; // ID do usuário
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      // Extrai o token do cabeçalho Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // ⚠️ CHAVE SECRETA: DEVE SER A MESMA USADA NO JwtModule.register()!
      secretOrKey:
        'MKSDNG1519782DSAFDHSDG5S4F56AF5D1G56FD1H2B1FD894GFB21VC3848FSA7E8W9QE7J7U98JKLI98L7UI45J61S25DA9AD78DSAF1D3H51FD7H8F4JHGF123XCVXVKLSADQWIUEETSKMCXZ8972131S56D4GJJHKLIUOUITYWEEQISKLAMD',
    });
  }

  async validate(payload: JwtPayload) {
    // Busca o usuário pelo ID contido no token (payload.sub)
    const user = this.userService.findUserSafeById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(
        'Token inválido ou usuário não encontrado.',
      );
    }

    // Retorna o objeto do usuário (sem a senha) para ser injetado em @Req() ou @User()
    return user;
  }
}
