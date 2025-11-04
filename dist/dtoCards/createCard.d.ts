import { Descricao } from './descricao';
export declare class CreateCard {
    id: string;
    titulo: string;
    descricao: Descricao;
    detalhes: string;
    imagem: string;
    estoque: number;
    valorUnitario: number;
    avaliacao?: number;
    tipo?: string;
}
