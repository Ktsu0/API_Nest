export interface CarrinhoItem {
    tipo: 'serie' | 'anime';
    produtoId: string;
    titulo: string;
    valorUnitario: number;
    quantidadeDesejada: number;
    estoqueDisponivel: number;
}
export interface CarrinhoValidacao {
    items: CarrinhoItem[];
    validacao: {
        totalItens: number;
        valorTotal: number;
        erros: string[];
    };
}
export interface CarrinhoInputItem {
    tipo: 'serie' | 'anime';
    id: string;
    quantidade: number;
}
