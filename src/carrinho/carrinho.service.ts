import { Injectable } from '@nestjs/common';
import { SeriesService } from 'src/cardsSerie/series.service';
import {
  CarrinhoValidacao,
  CarrinhoItem,
  CarrinhoInputItem,
} from './models/carrinho.model';
import { Serie } from './../cardsSerie/models/series.model';

@Injectable()
export class CarrinhoService {
  constructor(private readonly seriesService: SeriesService) {}

  validarCarrinho(itensCarrinho: CarrinhoInputItem[]): CarrinhoValidacao {
    const validacao: CarrinhoValidacao = {
      items: [],
      validacao: {
        totalItens: 0,
        valorTotal: 0,
        erros: [],
      },
    };

    let totalItens = 0;
    let valorTotal = 0;

    for (const item of itensCarrinho) {
      const serie = this.seriesService.findOne(item.id) as Serie | undefined;

      if (!serie) {
        validacao.validacao.erros.push(
          `Série com ID ${item.id} não encontrada.`,
        );
        continue;
      }

      const { id, titulo, estoque, valorUnitario } = serie;
      const quantidade = item.quantidade;

      // 2. Validações básicas
      if (quantidade <= 0) {
        validacao.validacao.erros.push(`Quantidade inválida para ${titulo}.`);
        continue;
      }

      // 3. Validação de Estoque
      if (quantidade > estoque) {
        validacao.validacao.erros.push(
          `Estoque insuficiente para ${titulo}. Pedido: ${quantidade}, Disponível: ${estoque}.`,
        );
      }

      const valorItem = valorUnitario * quantidade;

      // 4. Acumular totais e criar o item processado
      totalItens += quantidade;
      valorTotal += valorItem;

      validacao.items.push({
        serieId: id,
        titulo: titulo,
        valorUnitario: valorUnitario,
        quantidadeDesejada: quantidade,
        estoqueDisponivel: estoque,
      });
    }

    // 5. Finalizar totais
    validacao.validacao.totalItens = totalItens;
    // Arredondamento para garantir duas casas decimais no cálculo
    validacao.validacao.valorTotal = parseFloat(valorTotal.toFixed(2));

    return validacao;
  }

  /**
   * Simula a compra, verifica o estoque novamente e atualiza o estado (baixa no estoque).
   */
  finalizarCompra(itensCarrinho: CarrinhoInputItem[]): string[] {
    const validacao = this.validarCarrinho(itensCarrinho);

    // Se a validação encontrar erros, a compra é impedida.
    if (validacao.validacao.erros.length > 0) {
      // Retorna a lista de erros para ser exibida ao usuário
      return validacao.validacao.erros;
    }

    // Simulação de baixa no estoque: chama o SeriesService para atualizar.
    for (const item of itensCarrinho) {
      // Presumo que SeriesService tem um método para atualizar o estoque internamente.
      this.seriesService.atualizarEstoque(item.id, item.quantidade);
    }

    return [
      `Compra de ${validacao.validacao.totalItens} itens no total de R$ ${validacao.validacao.valorTotal.toFixed(2)} finalizada com sucesso.`,
    ];
  }
}
