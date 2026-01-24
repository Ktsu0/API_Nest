import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProdutoTipo } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as levenshtein from 'fast-levenshtein';

@Injectable()
export class SeriesService {
  constructor(private readonly prisma: PrismaService) {}

  private normalize(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  async findAll() {
    return this.prisma.serie.findMany({
      where: {
        tipo: ProdutoTipo.SERIE,
      },
      include: {
        meta: true,
      },
      orderBy: {
        titulo: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const serie = await this.prisma.serie.findUnique({
      where: { id },
      include: {
        meta: true,
      },
    });

    if (!serie) {
      throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
    }

    return serie;
  }

  async findTema(tema: string) {
    const temaBusca = this.normalize(tema);

    const series = await this.prisma.serie.findMany({
      where: {
        meta: {
          tema: {
            contains: temaBusca,
          },
        },
        tipo: ProdutoTipo.SERIE,
      },
      include: {
        meta: true,
      },
    });

    if (!series.length) {
      throw new NotFoundException(`Série com tema "${tema}" não encontrada.`);
    }

    return series;
  }

  async findTitulo(searchTerm: string) {
    const termBusca = this.normalize(searchTerm);

    let series = await this.prisma.serie.findMany({
      where: {
        titulo: {
          contains: termBusca,
          mode: 'insensitive',
        },
        tipo: ProdutoTipo.SERIE,
      },
      include: {
        meta: true,
      },
    });

    if (!series.length && termBusca.length >= 3) {
      const todas = await this.prisma.serie.findMany({
        where: { tipo: ProdutoTipo.SERIE },
        include: { meta: true },
      });

      const MAX_DISTANCE =
        termBusca.length > 8 ? 2 : termBusca.length > 5 ? 1 : 0;

      series = todas.filter((serie) => {
        const tituloSerie = this.normalize(serie.titulo);
        const distance = levenshtein.get(termBusca, tituloSerie);
        return distance <= MAX_DISTANCE;
      });
    }

    return series;
  }

  async addSerie(data: {
    titulo: string;
    detalhes: string;
    imagem: string;
    estoque: number;
    valorUnitario: Decimal;
    avaliacao?: Decimal;
    meta: {
      temporada: string;
      tema: string;
    };
  }) {
    return this.prisma.$transaction(async (tx) => {
      return tx.serie.create({
        data: {
          titulo: data.titulo,
          detalhes: data.detalhes,
          imagem: data.imagem,
          estoque: data.estoque,
          valorUnitario: data.valorUnitario,
          avaliacao: data.avaliacao,
          tipo: ProdutoTipo.SERIE,

          meta: {
            create: {
              temporada: data.meta.temporada,
              tema: this.normalize(data.meta.tema),
            },
          },
        },
        include: {
          meta: true,
        },
      });
    });
  }

  async updateImage(id: number, novaImagem: string) {
    try {
      return await this.prisma.serie.update({
        where: { id },
        data: { imagem: novaImagem },
        include: { meta: true },
      });
    } catch {
      throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
    }
  }

  async addAvaliacao(id: number, avaliacao: Decimal) {
    try {
      return await this.prisma.serie.update({
        where: { id },
        data: { avaliacao },
      });
    } catch {
      throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
    }
  }

  async updateSerie(
    id: number,
    updatedData: {
      titulo?: string;
      detalhes?: string;
      imagem?: string;
      estoque?: number;
      valorUnitario?: Decimal;
      avaliacao?: Decimal;
      meta?: {
        temporada?: string;
        tema?: string;
      };
    },
  ) {
    try {
      return await this.prisma.serie.update({
        where: { id },
        data: {
          titulo: updatedData.titulo,
          detalhes: updatedData.detalhes,
          imagem: updatedData.imagem,
          estoque: updatedData.estoque,
          valorUnitario: updatedData.valorUnitario,
          avaliacao: updatedData.avaliacao,

          meta: updatedData.meta
            ? {
                update: {
                  temporada: updatedData.meta.temporada,
                  tema: updatedData.meta.tema
                    ? this.normalize(updatedData.meta.tema)
                    : undefined,
                },
              }
            : undefined,
        },
        include: {
          meta: true,
        },
      });
    } catch {
      throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
    }
  }

  async deleteSerie(id: number) {
    try {
      await this.prisma.serie.delete({
        where: { id },
      });
      return `Série removida com sucesso.`;
    } catch {
      throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
    }
  }

  async atualizarEstoque(id: number, quantidade: number) {
    try {
      return await this.prisma.serie.update({
        where: { id },
        data: {
          estoque: {
            decrement: quantidade,
          },
        },
      });
    } catch {
      throw new NotFoundException(
        `Série com ID "${id}" não encontrada para atualizar estoque.`,
      );
    }
  }

  async ordemAlfabetica() {
    return this.prisma.serie.findMany({
      where: {
        tipo: ProdutoTipo.SERIE,
      },
      include: {
        meta: true,
      },
      orderBy: {
        titulo: 'asc',
      },
    });
  }
}
