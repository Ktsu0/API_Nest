import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CarItem {
  @IsString()
  @IsNotEmpty()
  serieId: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  valorUnitario: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantidadeDesejada: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  estoqueDisponivel: number;
}
