import { descricao } from './descricao';
export declare class CreateCard {
    id: string;
    titulo: string;
    descricao: descricao;
    detalhes: string;
    imagem: string;
    estoque: number;
    valorUnitario: number;
    avaliacao?: number;
}
