// src/series/series.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Serie } from './models/series.model';
import { topSeries } from './models/bancoDados';
import * as levenshtein from 'fast-levenshtein';
@Injectable()
export class SeriesService {
  private series: Serie[] = topSeries;

  findAll(): Serie[] {
    return this.series;
  }
  findOne(id: string): Serie {
    const serieEncontrada = this.series.find((serie) => serie.id === id);

    if (!serieEncontrada) {
      throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
    }

    return serieEncontrada;
  }
  findTema(tema: string): Serie[] {
    const temaBusca = this.normalize(tema);

    const seriesFiltradas = this.series.filter((serie) => {
      const temaSerie = this.normalize(serie.descricao.tema);
      return temaSerie.includes(temaBusca);
    });

    if (seriesFiltradas.length === 0) {
      throw new NotFoundException(`Série com tema "${tema}" não encontrada.`);
    }
    return seriesFiltradas;
  }

  private normalize(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  addSerie(serie: Serie): Serie {
    const novoId =
      Date.now().toString() + Math.floor(Math.random() * 1000).toString();
    const novaSerie = { ...serie, id: novoId };
    this.series.push(novaSerie);
    return novaSerie;
  }

  updateImage(id: string, novaImagem: string): Serie {
    const serieEncontrada = this.series.find((serie) => serie.id === id);
    if (!serieEncontrada) {
      throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
    }
    serieEncontrada.imagem = novaImagem;
    return serieEncontrada;
  }

  ordemAlfabetica(): Serie[] {
    const seriesCopia = [...this.series];

    seriesCopia.sort((a, b) => a.titulo.localeCompare(b.titulo));

    return seriesCopia;
  }

  addAvaliacao(id: string, avaliacao: number): void {
    const serie = this.series.find((s) => s.id === id);

    if (!serie) {
      throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
    }
    serie.avaliacao = avaliacao;
  }

  findTitulo(searchTerm: string): Serie[] {
    const termBusca = this.normalize(searchTerm);

    let seriesFiltradas = this.series.filter((serie) => {
      const tituloSerie = this.normalize(serie.titulo);
      return tituloSerie.includes(termBusca);
    });

    if (seriesFiltradas.length === 0 && termBusca.length >= 3) {
      const MAX_DISTANCE =
        termBusca.length > 8 ? 2 : termBusca.length > 5 ? 1 : 0;

      seriesFiltradas = this.series.filter((serie) => {
        const tituloSerie = this.normalize(serie.titulo);

        // Itera sobre todas as séries para calcular a distância
        const distance = levenshtein.get(termBusca, tituloSerie);

        return distance <= MAX_DISTANCE;
      });
    }

    return seriesFiltradas;
  }

  updateSerie(id: string, updatedData: Partial<Serie>): Serie {
    const index = this.series.findIndex((serie) => serie.id === id);
    if (index === -1) {
      throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
    }
    const current = this.series[index];
    this.series[index] = {
      ...current,
      ...updatedData,
      descricao: {
        ...current.descricao,
        ...(updatedData.descricao || {}),
      },
    };

    return this.series[index];
  }

  deleteSerie(id: string): string {
    const index = this.series.findIndex((serie) => serie.id === id);
    if (index === -1) {
      throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
    }

    const titulo = this.series[index].titulo;
    this.series.splice(index, 1);
    return `Série "${titulo}" removida com sucesso.`;
  }

  atualizarEstoque(id: string, quantidade: number): void {
    const serie = this.series.find((s) => s.id === id);

    if (!serie) {
      throw new NotFoundException(
        `Série com ID "${id}" não encontrada para atualizar estoque.`,
      );
    }

    serie.estoque = Math.max(0, serie.estoque - quantidade);
  }
}
