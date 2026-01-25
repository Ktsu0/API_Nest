import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProdutoTipo } from '@prisma/client';
import * as levenshtein from 'fast-levenshtein';

@Injectable()
export class AnimeService {
  constructor(private readonly prisma: PrismaService) {}

  private normalize(texto: string): string {
    return (texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  private formatAnime(anime: any) {
    if (!anime) return anime;
    return {
      ...anime,
      valorUnitario: anime.valorUnitario ? Number(anime.valorUnitario) : 0,
      avaliacao: anime.avaliacao ? Number(anime.avaliacao) : null,
    };
  }

  async findAll() {
    // Workaround for Postgres Enum cast error: fetch all and filter in memory
    const all = await this.prisma.serie.findMany({
      include: { meta: true },
      orderBy: { titulo: 'asc' },
    });
    return all
      .filter((s) => s.tipo === ProdutoTipo.ANIME)
      .map((a) => this.formatAnime(a));
  }

  async findOne(id: number) {
    const anime = await this.prisma.serie.findUnique({
      where: { id },
      include: { meta: true },
    });
    if (!anime)
      throw new NotFoundException(`Anime com ID "${id}" não encontrado.`);
    return this.formatAnime(anime);
  }

  async findTema(tema: string) {
    const temaBusca = this.normalize(tema);
    const all = await this.prisma.serie.findMany({
      include: { meta: true },
    });
    return all
      .filter(
        (s) =>
          s.tipo === ProdutoTipo.ANIME &&
          this.normalize(s.meta?.tema).includes(temaBusca),
      )
      .map((a) => this.formatAnime(a));
  }

  async findTitulo(searchTerm: string) {
    const termBusca = this.normalize(searchTerm);
    const all = await this.prisma.serie.findMany({
      include: { meta: true },
    });

    let filtered = all.filter(
      (s) =>
        s.tipo === ProdutoTipo.ANIME &&
        this.normalize(s.titulo).includes(termBusca),
    );

    if (!filtered.length && termBusca.length >= 3) {
      const MAX_DISTANCE =
        termBusca.length > 8 ? 2 : termBusca.length > 5 ? 1 : 0;
      filtered = all.filter((serie) => {
        if (serie.tipo !== ProdutoTipo.ANIME) return false;
        const distance = levenshtein.get(
          termBusca,
          this.normalize(serie.titulo),
        );
        return distance <= MAX_DISTANCE;
      });
    }
    return filtered.map((a) => this.formatAnime(a));
  }

  async addAvaliacao(id: number, avaliacao: number) {
    try {
      await this.prisma.serie.update({
        where: { id },
        data: { avaliacao: Number(avaliacao) },
      });
      return `Avaliação adicionada com sucesso.`;
    } catch {
      throw new NotFoundException(`Anime com ID "${id}" não encontrado.`);
    }
  }

  async atualizarEstoque(id: number, quantidade: number) {
    try {
      return await this.prisma.serie.update({
        where: { id },
        data: { estoque: { decrement: Number(quantidade) } },
      });
    } catch {
      throw new NotFoundException(`Anime com ID "${id}" não encontrado.`);
    }
  }

  async addAnime(data: any) {
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.serie.create({
        data: {
          titulo: data.titulo,
          detalhes: data.detalhes,
          imagem: data.imagem,
          estoque: Number(data.estoque),
          valorUnitario: Number(data.valorUnitario),
          avaliacao: data.avaliacao ? Number(data.avaliacao) : null,
          tipo: ProdutoTipo.ANIME,
          meta: {
            create: {
              temporada: String(data.meta.temporada),
              tema: this.normalize(data.meta.tema),
            },
          },
        },
        include: { meta: true },
      });
      return this.formatAnime(created);
    });
  }

  async updateAnime(id: number, updatedData: any) {
    try {
      const updated = await this.prisma.serie.update({
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
      return this.formatAnime(updated);
    } catch (e) {
      throw new NotFoundException(`Anime com ID "${id}" não encontrado.`);
    }
  }

  async deleteAnime(id: number) {
    try {
      await this.prisma.serie.delete({ where: { id } });
      return `Anime removido com sucesso.`;
    } catch {
      throw new NotFoundException(`Anime com ID "${id}" não encontrado.`);
    }
  }

  async ordemAlfabetica() {
    return this.findAll();
  }
}
