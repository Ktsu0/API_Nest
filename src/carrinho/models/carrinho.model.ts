export interface CarrinhoInputItem {
  id: number;
  tipo: 'serie' | 'anime';
  quantidade: number;
}

export interface CarrinhoItem {
  tipo: 'serie' | 'anime';
  produtoId: number;
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
