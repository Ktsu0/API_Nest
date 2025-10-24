import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class Validacao {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  totalItens: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  valorTotal: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  erros: string[];
}
