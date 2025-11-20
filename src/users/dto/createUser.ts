import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  // --- Autenticação ---
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // --- Informações Pessoais ---
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  // --- Contato ---
  @IsString()
  @IsNotEmpty()
  Cpf: string;

  @IsString()
  @IsNotEmpty()
  telefone: string;

  @IsString()
  @IsNotEmpty()
  cep: string;

  // --- Outros ---
  @IsString()
  @IsNotEmpty()
  genero: string;

  @IsString()
  @IsNotEmpty()
  nascimento: string;
}
