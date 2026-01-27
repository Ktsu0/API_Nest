import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProdutoTipo } from '@prisma/client';
import * as levenshtein from 'fast-levenshtein';

@Injectable()
export class SeriesService {
  constructor(private readonly prisma: PrismaService) {}

  private normalize(texto: string): string {
    return (texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  private formatSerie(serie: any) {
    if (!serie) return serie;
    return {
      ...serie,
      valorUnitario: serie.valorUnitario ? Number(serie.valorUnitario) : 0,
      avaliacao: serie.avaliacao ? Number(serie.avaliacao) : null,
    };
  }

  async findAll() {
    // Workaround for Postgres Enum cast error: fetch all and filter in memory
    const all = await this.prisma.serie.findMany({
      include: { meta: true },
      orderBy: { titulo: 'asc' },
    });
    return all
      .filter((s) => s.tipo === ProdutoTipo.SERIE)
      .map((s) => this.formatSerie(s));
  }

  async findOne(id: number) {
    const serie = await this.prisma.serie.findUnique({
      where: { id },
      include: { meta: true },
    });
    if (!serie)
      throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
    return this.formatSerie(serie);
  }

  async findTema(tema: string) {
    const temaBusca = this.normalize(tema);
    const all = await this.prisma.serie.findMany({
      include: { meta: true },
    });
    return all
      .filter(
        (s) =>
          s.tipo === ProdutoTipo.SERIE &&
          this.normalize(s.meta?.tema).includes(temaBusca),
      )
      .map((s) => this.formatSerie(s));
  }

  async findTitulo(searchTerm: string) {
    const termBusca = this.normalize(searchTerm);
    const all = await this.prisma.serie.findMany({
      include: { meta: true },
    });

    let filtered = all.filter(
      (s) =>
        s.tipo === ProdutoTipo.SERIE &&
        this.normalize(s.titulo).includes(termBusca),
    );

    if (!filtered.length && termBusca.length >= 3) {
      const MAX_DISTANCE =
        termBusca.length > 8 ? 2 : termBusca.length > 5 ? 1 : 0;
      filtered = all.filter((serie) => {
        if (serie.tipo !== ProdutoTipo.SERIE) return false;
        const distance = levenshtein.get(
          termBusca,
          this.normalize(serie.titulo),
        );
        return distance <= MAX_DISTANCE;
      });
    }
    return filtered.map((s) => this.formatSerie(s));
  }

  async addAvaliacao(id: number, avaliacao: number) {
    return this.prisma.$transaction(async (tx) => {
      try {
        await tx.serie.update({
          where: { id },
          data: { avaliacao: Number(avaliacao) },
        });
        return `Avaliação adicionada com sucesso.`;
      } catch {
        throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
      }
    });
  }

  async atualizarEstoque(id: number, quantidade: number) {
    return this.prisma.$transaction(async (tx) => {
      try {
        return await tx.serie.update({
          where: { id },
          data: { estoque: { decrement: Number(quantidade) } },
        });
      } catch {
        throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
      }
    });
  }

  async addSerie(data: any) {
    console.log(
      '[SeriesService] Recebido dados para criar:',
      JSON.stringify(data),
    );
    return this.prisma.$transaction(async (tx) => {
      // Determina o tipo final: Usa o enviado ou o padrão do serviço
      const tipoFinal =
        data.tipo?.toUpperCase() === 'ANIME'
          ? ProdutoTipo.ANIME
          : ProdutoTipo.SERIE;

      console.log(`[SeriesService] Classificando como: ${tipoFinal}`);

      const created = await tx.serie.create({
        data: {
          titulo: data.titulo,
          detalhes: data.detalhes,
          imagem: data.imagem,
          estoque: Number(data.estoque),
          valorUnitario: Number(data.valorUnitario),
          avaliacao: data.avaliacao ? Number(data.avaliacao) : null,
          tipo: tipoFinal,
          meta: {
            create: {
              temporada: String(data.meta.temporada),
              tema: this.normalize(data.meta.tema),
            },
          },
        },
        include: { meta: true },
      });
      console.log(
        '[SeriesService] Objeto criado no banco:',
        JSON.stringify(created),
      );
      return this.formatSerie(created);
    });
  }

  async updateSerie(id: number, updatedData: any) {
    return this.prisma.$transaction(async (tx) => {
      try {
        const updated = await tx.serie.update({
          where: { id },
          data: {
            titulo: updatedData.titulo,
            detalhes: updatedData.detalhes,
            imagem: updatedData.imagem,
            estoque:
              updatedData.estoque !== undefined
                ? Number(updatedData.estoque)
                : undefined,
            valorUnitario:
              updatedData.valorUnitario !== undefined
                ? Number(updatedData.valorUnitario)
                : undefined,
            avaliacao:
              updatedData.avaliacao !== undefined
                ? Number(updatedData.avaliacao)
                : undefined,
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
          include: { meta: true },
        });
        return this.formatSerie(updated);
      } catch (e) {
        throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
      }
    });
  }

  async deleteSerie(id: number) {
    console.log(`[SeriesService] Tentando deletar série ID: ${id}`);
    return this.prisma.$transaction(async (tx) => {
      try {
        const deleted = await tx.serie.delete({ where: { id } });
        console.log(
          `[SeriesService] Série ID: ${id} deletada com sucesso. Titulo: ${deleted.titulo}`,
        );
        return `Série removida com sucesso.`;
      } catch (e) {
        console.error(`[SeriesService] Erro ao deletar série ID: ${id}`, e);
        throw new NotFoundException(
          `Série com ID "${id}" não encontrada ou erro ao deletar.`,
        );
      }
    });
  }

  async ordemAlfabetica() {
    return this.findAll();
  }
}
