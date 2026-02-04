import {
  Allow,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Descricao } from './descricao';

export class CreateCard {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Descricao)
  meta: Descricao;

  @IsString()
  @IsNotEmpty()
  detalhes: string;

  @IsString()
  @IsNotEmpty()
  imagem: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  estoque: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  valorUnitario: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(5)
  @Min(1)
  avaliacao?: number;

  @IsOptional()
  @IsString()
  tipo?: string;
}
