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
    erros: string[]; // Para erros de estoque ou validação
  };
}

// Além disso, vamos definir o DTO de entrada para o carrinho:
export interface CarrinhoInputItem {
  id: string; // ID da série
  quantidade: number; // Quantidade desejada
}
