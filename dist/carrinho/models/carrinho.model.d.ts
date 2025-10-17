export interface CarrinhoItem {
    serieId: string;
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
    id: string;
    quantidade: number;
}
