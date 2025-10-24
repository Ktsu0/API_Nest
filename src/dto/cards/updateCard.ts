import { CreateCard } from './createCard';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCardDto extends PartialType(CreateCard) {}
