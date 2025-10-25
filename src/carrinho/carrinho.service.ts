import { Injectable } from '@nestjs/common';
import { SeriesService } from './../cardsSerie/series.service';
import { AnimeService } from './../cardsAnime/anime.service';
import {
  CarrinhoValidacao,
  CarrinhoInputItem,
  CarrinhoItem,
} from './models/carrinho.model';
import { Serie } from './../cardsSerie/models/series.model';
import { Animes } from './../cardsAnime/models/animes.model';

@Injectable()
export class CarrinhoService {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly animesService: AnimeService,
  ) {}

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
      // Seleciona o serviço correto
      let produto: Serie | Animes | undefined;
      if (item.tipo === 'serie') produto = this.seriesService.findOne(item.id);
      else if (item.tipo === 'anime')
        produto = this.animesService.findOne(item.id);

      if (!produto) {
        validacao.validacao.erros.push(
          `${item.tipo === 'serie' ? 'Série' : 'Anime'} com ID ${item.id} não encontrada.`,
        );
        continue;
      }

      const { id, titulo, estoque, valorUnitario } = produto;
      const quantidade = item.quantidade;

      // Validação básica de quantidade
      if (quantidade <= 0) {
        validacao.validacao.erros.push(`Quantidade inválida para ${titulo}.`);
        continue;
      }

      // Validação de estoque
      if (quantidade > estoque) {
        validacao.validacao.erros.push(
          `Estoque insuficiente para ${titulo}. Pedido: ${quantidade}, Disponível: ${estoque}.`,
        );
      }

      const valorItem = valorUnitario * quantidade;
      totalItens += quantidade;
      valorTotal += valorItem;

      // Adiciona ao carrinho
      validacao.items.push({
        tipo: item.tipo,
        produtoId: id,
        titulo,
        valorUnitario,
        quantidadeDesejada: quantidade,
        estoqueDisponivel: estoque,
      });
    }

    validacao.validacao.totalItens = totalItens;
    validacao.validacao.valorTotal = parseFloat(valorTotal.toFixed(2));

    return validacao;
  }

  finalizarCompra(itensCarrinho: CarrinhoInputItem[]): string[] {
    const validacao = this.validarCarrinho(itensCarrinho);

    if (validacao.validacao.erros.length > 0) {
      return validacao.validacao.erros;
    }

    // Baixa no estoque
    for (const item of itensCarrinho) {
      if (item.tipo === 'serie')
        this.seriesService.atualizarEstoque(item.id, item.quantidade);
      else if (item.tipo === 'anime')
        this.animesService.atualizarEstoque(item.id, item.quantidade);
    }

    return [
      `Compra de ${validacao.validacao.totalItens} itens no total de R$ ${validacao.validacao.valorTotal.toFixed(2)} finalizada com sucesso.`,
    ];
  }
}
