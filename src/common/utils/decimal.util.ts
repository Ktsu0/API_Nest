import { Decimal } from '@prisma/client/runtime/library';

export function toDecimal(value: number | string) {
  return new Decimal(value);
}
