import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CarrinhoValidacao, CarrinhoInputItem } from './models/carrinho.model';
import { ProdutoTipo, Prisma } from '@prisma/client';

@Injectable()
export class CarrinhoService {
  constructor(private readonly prisma: PrismaService) {}

  // ==============================
  // Validação do carrinho
  // ==============================
  async validarCarrinho(
    itensCarrinho: CarrinhoInputItem[],
  ): Promise<CarrinhoValidacao> {
    console.log(
      '[CarrinhoService] Validando itens:',
      JSON.stringify(itensCarrinho),
    );
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
      const itemId = Number(item.id);
      const itemTipo = String(item.tipo).toLowerCase();

      const produto = await this.prisma.serie.findUnique({
        where: { id: itemId },
        select: {
          id: true,
          titulo: true,
          estoque: true,
          valorUnitario: true,
          tipo: true,
        },
      });

      if (!produto) {
        validacao.validacao.erros.push(
          `Produto com ID ${item.id} não encontrado.`,
        );
        continue;
      }

      // 💡 MELHORIA: Usamos o tipo do BANCO como verdade absoluta.
      // Se o frontend mandou 'anime' mas no banco é 'SERIE',
      // ainda mostramos no carrinho com o tipo correto do banco.
      const produtoTipoStr = String(produto.tipo).toLowerCase() as
        | 'serie'
        | 'anime';

      // Apenas logamos um aviso nos erros se houver divergência, mas não bloqueamos o item
      if (itemTipo !== produtoTipoStr) {
        console.warn(
          `Divergência de tipo para ID ${produto.id}: Frontend=${itemTipo}, DB=${produtoTipoStr}`,
        );
      }

      if (item.quantidade <= 0) {
        validacao.validacao.erros.push(
          `Quantidade inválida para "${produto.titulo}".`,
        );
        continue;
      }

      if (produto.estoque < item.quantidade) {
        validacao.validacao.erros.push(
          `Estoque insuficiente para "${produto.titulo}". Pedido: ${item.quantidade}, Disponível: ${produto.estoque}.`,
        );
      }

      const valorItem = Number(produto.valorUnitario) * item.quantidade;
      totalItens += item.quantidade;
      valorTotal = valorTotal.add(new Prisma.Decimal(valorItem));

      validacao.items.push({
        tipo: produtoTipoStr, // Usamos o tipo do banco
        produtoId: produto.id,
        titulo: produto.titulo,
        valorUnitario: Number(produto.valorUnitario),
        quantidadeDesejada: item.quantidade,
        estoqueDisponivel: produto.estoque,
      });
    }

    validacao.validacao.totalItens = totalItens;
    validacao.validacao.valorTotal = Number(valorTotal.toFixed(2));

    console.log(
      '[CarrinhoService] Resultado da validação:',
      JSON.stringify(validacao),
    );
    return validacao;
  }

  // ==============================
  // Finalização da compra atômica
  // ==============================
  async finalizarCompra(itensCarrinho: CarrinhoInputItem[]): Promise<string[]> {
    return this.prisma.$transaction(async (tx) => {
      let totalItens = 0;
      let valorTotal = new Prisma.Decimal(0);
      const erros: string[] = [];

      // ==============================
      // Validação + baixa em loop único
      // ==============================
      for (const item of itensCarrinho) {
        const produto = await tx.serie.findUnique({
          where: { id: item.id },
          select: {
            id: true,
            titulo: true,
            estoque: true,
            valorUnitario: true,
            tipo: true,
          },
        });

        if (!produto) {
          erros.push(`Produto com ID ${item.id} não encontrado.`);
          continue;
        }

        const itemTipo = String(item.tipo).toLowerCase();
        const produtoTipoStr = String(produto.tipo).toLowerCase();

        if (itemTipo !== produtoTipoStr) {
          console.warn(
            `Divergência de tipo na compra para ID ${produto.id}: Frontend=${itemTipo}, DB=${produtoTipoStr}`,
          );
        }

        if (item.quantidade <= 0) {
          erros.push(`Quantidade inválida para "${produto.titulo}".`);
          continue;
        }

        if (produto.estoque < item.quantidade) {
          erros.push(
            `Estoque insuficiente para "${produto.titulo}". Pedido: ${item.quantidade}, Disponível: ${produto.estoque}.`,
          );
          continue;
        }

        await tx.serie.update({
          where: { id: produto.id },
          data: {
            estoque: {
              decrement: Number(item.quantidade),
            },
          },
        });
        const valorItem = Number(produto.valorUnitario) * item.quantidade;

        totalItens += item.quantidade;
        valorTotal = valorTotal.add(new Prisma.Decimal(valorItem));
      }

      if (erros.length > 0) {
        throw new BadRequestException(erros);
      }

      return [
        `Compra de ${totalItens} itens no total de R$ ${Number(
          valorTotal.toFixed(2),
        )} finalizada com sucesso.`,
      ];
    });
  }
}
