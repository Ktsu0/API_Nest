import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class AvaliacaoDTO {
  @IsNotEmpty()
  @IsString()
  ID: string;

  @IsNumber()
  @IsNotEmpty()
  @Max(5)
  @Min(1)
  avaliacao: number;
}
