export interface Animes {
    id: string;
    titulo: string;
    descricao: {
        temporada: string;
        tema: string;
    };
    detalhes: string;
    imagem: string;
    estoque: number;
    valorUnitario: number;
    avaliacao?: number;
    tipo?: string;
}
