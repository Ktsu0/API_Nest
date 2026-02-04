export interface Serie {
    id: string;
    titulo: string;
    meta: {
        temporada: string;
        tema: string;
    };
    detalhes: string;
    imagem: string;
    estoque: number;
    valorUnitario: number;
    votos: number;
    avaliacao?: number;
    tipo?: string;
}
