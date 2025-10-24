import { IsString, IsNotEmpty } from 'class-validator';

export class Descricao {
  @IsString()
  @IsNotEmpty()
  temporada: string;

  @IsString()
  @IsNotEmpty()
  tema: string;
}
