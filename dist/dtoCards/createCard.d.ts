import { Descricao } from './descricao';
export declare class CreateCard {
    titulo: string;
    meta: Descricao;
    detalhes: string;
    imagem: string;
    estoque: number;
    valorUnitario: number;
    avaliacao?: number;
    tipo?: string;
}
