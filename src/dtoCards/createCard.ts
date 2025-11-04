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
} from 'class-validator';
import { Descricao } from './descricao';

export class CreateCard {
  @Allow()
  id: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsObject()
  descricao: Descricao;

  @IsString()
  @IsNotEmpty()
  detalhes: string;

  @IsString()
  @IsUrl()
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
