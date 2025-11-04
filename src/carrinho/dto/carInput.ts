import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';

export class CarInput {
  @IsString()
  @IsNotEmpty()
  tipo: 'serie' | 'anime';

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantidade: number;
}
