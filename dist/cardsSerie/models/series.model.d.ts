export interface Serie {
    id: string;
    titulo: string;
    descricao: {
        temporada: string;
        tema: string;
    };
    detalhes: string;
    imagem: string;
    avaliacao?: number;
}
