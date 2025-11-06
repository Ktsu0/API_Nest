// src/Animes/Animes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Serie } from 'src/model/series.model';
import * as levenshtein from 'fast-levenshtein';
import { catalogoCompleto } from 'src/model/bancoDados';
@Injectable()
export class AnimeService {
  private Animes: Serie[] = catalogoCompleto.filter(
    (item) => item.tipo === 'anime',
  );

  findAll(): Serie[] {
    return this.Animes;
  }
  findOne(id: string): Serie {
    const AnimeEncontrada = this.Animes.find((Anime) => Anime.id === id);
    if (!AnimeEncontrada) {
      throw new NotFoundException(`Anime com ID "${id}" não encontrada.`);
    }
    return AnimeEncontrada;
  }
  findTema(tema: string): Serie[] {
    const temaBusca = this.normalize(tema);

    const AnimesFiltradas = this.Animes.filter((Anime) => {
      const temaAnime = this.normalize(Anime.descricao.tema);
      return temaAnime.includes(temaBusca);
    });

    if (AnimesFiltradas.length === 0) {
      throw new NotFoundException(`Anime com tema "${tema}" não encontrada.`);
    }
    return AnimesFiltradas;
  }

  private normalize(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  addAnime(Anime: Serie): Serie {
    const novoId =
      Date.now().toString() + Math.floor(Math.random() * 1000).toString();
    const novaAnime = { ...Anime, id: novoId, tipo: 'anime' };
    this.Animes.push(novaAnime);
    return novaAnime;
  }

  updateImage(id: string, novaImagem: string): Serie {
    const AnimeEncontrada = this.Animes.find((Anime) => Anime.id === id);
    if (!AnimeEncontrada) {
      throw new NotFoundException(`Anime com ID "${id}" não encontrada.`);
    }
    AnimeEncontrada.imagem = novaImagem;
    return AnimeEncontrada;
  }

  ordemAlfabetica(): Serie[] {
    const AnimesCopia = [...this.Animes];

    AnimesCopia.sort((a, b) => a.titulo.localeCompare(b.titulo));

    return AnimesCopia;
  }

  addAvaliacao(id: string, avaliacao: number): void {
    const Anime = this.Animes.find((s) => s.id === id);

    if (!Anime) {
      throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
    }
    Anime.avaliacao = avaliacao;
  }

  findTitulo(searchTerm: string): Serie[] {
    const termBusca = this.normalize(searchTerm);

    let AnimesFiltradas = this.Animes.filter((Anime) => {
      const tituloAnime = this.normalize(Anime.titulo);
      return tituloAnime.includes(termBusca);
    });

    if (AnimesFiltradas.length === 0 && termBusca.length >= 3) {
      const MAX_DISTANCE =
        termBusca.length > 8 ? 2 : termBusca.length > 5 ? 1 : 0;

      AnimesFiltradas = this.Animes.filter((Anime) => {
        const tituloAnime = this.normalize(Anime.titulo);

        // Itera sobre todas as Animes para calcular a distância
        const distance = levenshtein.get(termBusca, tituloAnime);

        return distance <= MAX_DISTANCE;
      });
    }

    return AnimesFiltradas;
  }

  updateAnime(id: string, updatedData: Partial<Serie>): Serie {
    const index = this.Animes.findIndex((Anime) => Anime.id === id);
    if (index === -1) {
      throw new NotFoundException(`Anime com ID "${id}" não encontrada.`);
    }
    const current = this.Animes[index];
    this.Animes[index] = {
      ...current,
      ...updatedData,
      descricao: {
        ...current.descricao,
        ...(updatedData.descricao || {}),
      },
    };

    return this.Animes[index];
  }

  deleteAnime(id: string): string {
    const index = this.Animes.findIndex((Anime) => Anime.id === id);
    if (index === -1) {
      throw new NotFoundException(`Anime com ID "${id}" não encontrada.`);
    }

    const titulo = this.Animes[index].titulo;
    this.Animes.splice(index, 1);
    return `Anime "${titulo}" removida com sucesso.`;
  }

  atualizarEstoque(id: string, quantidade: number): void {
    const Anime = this.Animes.find((s) => s.id === id);

    if (!Anime) {
      throw new NotFoundException(
        `Anime com ID "${id}" não encontrada para atualizar estoque.`,
      );
    }

    Anime.estoque = Math.max(0, Anime.estoque - quantidade);
  }
}
