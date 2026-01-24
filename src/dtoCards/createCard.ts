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
import { Decimal } from '@prisma/client/runtime/library';

export class CreateCard {
  @Allow()
  id: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsObject()
  meta: Descricao;

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
  valorUnitario: Decimal;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(5)
  @Min(1)
  avaliacao?: Decimal;

  @IsOptional()
  @IsString()
  tipo?: string;
}
