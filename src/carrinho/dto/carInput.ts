import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';

export class CarInput {
  @IsString()
  @IsNotEmpty()
  tipo: 'serie' | 'anime';

  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantidade: number;
}
