import { IsNotEmpty, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class IdParamDto {
  @IsNumberString()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}
