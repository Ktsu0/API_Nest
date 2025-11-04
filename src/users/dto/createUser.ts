import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  // --- Autenticação ---

  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório para o registro.' })
  email: string;

  @IsString({ message: 'A senha deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;

  // --- Informações Pessoais ---

  @IsString({ message: 'O nome deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O primeiro nome é obrigatório.' })
  firstName: string;

  @IsString({ message: 'O sobrenome deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O sobrenome é obrigatório.' })
  lastName: string;

  // --- Detalhes de Contato/Endereço ---

  @IsString({ message: 'O CPF deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  Cpf: string; // Nota: Você pode querer adicionar validação regex para CPF

  @IsString({ message: 'O telefone deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  telefone: string;

  @IsString({ message: 'O CEP deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  cep: string; // Nota: Você pode querer adicionar validação regex para CEP

  // --- Outros Detalhes ---

  @IsString({ message: 'O campo gênero deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O gênero é obrigatório.' })
  genero: string;

  @IsString({ message: 'A data de nascimento deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória.' })
  nascimento: string;
}
