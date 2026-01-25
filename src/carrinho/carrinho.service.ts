import { Injectable } from '@nestjs/common';
import { SeriesService } from './../cardsSerie/series.service';
import { AnimeService } from './../cardsAnime/anime.service';
import { CarrinhoValidacao, CarrinhoInputItem } from './models/carrinho.model';
import { Serie, ProdutoTipo, Prisma } from '@prisma/client';

@Injectable()
export class CarrinhoService {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly animesService: AnimeService,
  ) {}

  // ==============================
  // Validação completa do carrinho
  // ==============================
  async validarCarrinho(
    itensCarrinho: CarrinhoInputItem[],
  ): Promise<CarrinhoValidacao> {
    const validacao: CarrinhoValidacao = {
      items: [],
      validacao: {
        totalItens: 0,
        valorTotal: 0,
        erros: [],
      },
    };

    let totalItens = 0;
    let valorTotal = new Prisma.Decimal(0);

    for (const item of itensCarrinho) {
      let produto: Serie | null = null;

      // Seleção direta pelo tipo
      try {
        if (item.tipo === 'serie') {
          produto = await this.seriesService.findOne(item.id);
        } else if (item.tipo === 'anime') {
          produto = await this.animesService.findOne(item.id);
        }
      } catch {
        produto = null;
      }

      if (!produto) {
        validacao.validacao.erros.push(
          `Produto com ID ${item.id} não encontrado em nenhum catálogo.`,
        );
        continue;
      }

      const { id, titulo, estoque, valorUnitario, tipo } = produto;
      const quantidade = item.quantidade;

      // ==============================
      // Validações de negócio
      // ==============================
      if (quantidade <= 0) {
        validacao.validacao.erros.push(`Quantidade inválida para "${titulo}".`);
        continue;
      }

      if (quantidade > estoque) {
        validacao.validacao.erros.push(
          `Estoque insuficiente para "${titulo}". Pedido: ${quantidade}, Disponível: ${estoque}.`,
        );
      }

      // ==============================
      // Cálculo financeiro
      // ==============================
      const valorItem = Number(valorUnitario) * quantidade;

      totalItens += quantidade;
      valorTotal = valorTotal.add(new Prisma.Decimal(valorItem));

      // ==============================
      // Registro do item validado
      // ==============================
      validacao.items.push({
        tipo: tipo === ProdutoTipo.SERIE ? 'serie' : 'anime',
        produtoId: id,
        titulo,
        valorUnitario: Number(valorUnitario),
        quantidadeDesejada: quantidade,
        estoqueDisponivel: estoque,
      });
    }

    validacao.validacao.totalItens = totalItens;
    validacao.validacao.valorTotal = Number(valorTotal.toFixed(2));

    return validacao;
  }

  // ==============================
  // Finalização da compra
  // ==============================
  async finalizarCompra(itensCarrinho: CarrinhoInputItem[]): Promise<string[]> {
    const validacao = await this.validarCarrinho(itensCarrinho);

    if (validacao.validacao.erros.length > 0) {
      return validacao.validacao.erros;
    }

    // Baixa de estoque transacional por tipo
    for (const item of itensCarrinho) {
      if (item.tipo === 'serie') {
        await this.seriesService.atualizarEstoque(item.id, item.quantidade);
      } else if (item.tipo === 'anime') {
        await this.animesService.atualizarEstoque(item.id, item.quantidade);
      }
    }

    return [
      `Compra de ${validacao.validacao.totalItens} itens no total de R$ ${validacao.validacao.valorTotal.toFixed(
        2,
      )} finalizada com sucesso.`,
    ];
  }
}
