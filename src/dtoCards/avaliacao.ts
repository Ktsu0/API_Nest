import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';

export class AvaliacaoDTO {
  @IsNotEmpty()
  @IsString()
  ID: string;

  @IsNumber()
  @IsNotEmpty()
  @Max(5)
  @Min(1)
  avaliacao: Decimal;
}
