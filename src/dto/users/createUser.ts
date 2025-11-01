import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório para o registro.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
