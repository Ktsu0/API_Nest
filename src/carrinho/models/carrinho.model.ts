export interface CarrinhoItem {
  tipo: 'serie' | 'anime';
  produtoId: string;
  titulo: string;
  valorUnitario: number;
  quantidadeDesejada: number;
  estoqueDisponivel: number;
}

// Resultado da validação do carrinho
export interface CarrinhoValidacao {
  items: CarrinhoItem[];
  validacao: {
    totalItens: number;
    valorTotal: number;
    erros: string[];
  };
}

// DTO de entrada para o carrinho
export interface CarrinhoInputItem {
  tipo: 'serie' | 'anime';
  id: string;
  quantidade: number;
}
