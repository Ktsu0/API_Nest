import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';

export class CarInput {
  @IsString()
  @IsNotEmpty()
  id: string; // ID da série

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantidade: number; // Quantidade desejada
}
