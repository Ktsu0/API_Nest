// src/users/dto/login-user.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  password: string;
}
