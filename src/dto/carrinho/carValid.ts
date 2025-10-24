import { IsArray, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { CarItem } from './carItem';
import { Validacao } from './validacao';
import { Type } from 'class-transformer';

export class CarValidacao {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CarItem)
  items: CarItem[];

  @ValidateNested()
  @Type(() => Validacao)
  @IsNotEmpty()
  validacao: Validacao;
}
