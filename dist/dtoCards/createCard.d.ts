import { Descricao } from './descricao';
import { Decimal } from '@prisma/client/runtime/library';
export declare class CreateCard {
    id: string;
    titulo: string;
    meta: Descricao;
    detalhes: string;
    imagem: string;
    estoque: number;
    valorUnitario: Decimal;
    avaliacao?: Decimal;
    tipo?: string;
}
