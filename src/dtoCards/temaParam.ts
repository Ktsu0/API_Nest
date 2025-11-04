import { IsNotEmpty, IsString } from 'class-validator';

export class TemaParamDto {
  @IsString()
  @IsNotEmpty()
  tema: string;
}
