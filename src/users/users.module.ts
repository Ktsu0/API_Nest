// src/app.module.ts (Atualizado)
import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:
        'MKSDNG1519782DSAFDHSDG5S4F56AF5D1G56FD1H2B1FD894GFB21VC3848FSA7E8W9QE7J7U98JKLI98L7UI45J61S25DA9AD78DSAF1D3H51FD7H8F4JHGF123XCVXVKLSADQWIUEETSKMCXZ8972131S56D4GJJHKLIUOUITYWEEQISKLAMD',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
