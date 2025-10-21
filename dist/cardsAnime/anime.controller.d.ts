import { AnimeService } from './anime.service';
import type { Animes } from './models/animes.model';
export declare class AnimeController {
    private readonly animesService;
    constructor(animesService: AnimeService);
    findAll(): Animes[];
    findOne(id: string): Animes;
    findTema(tema: string): Animes[];
    ordemAlfabetica(): Animes[];
    findByTitle(q: string): Animes[];
    addAnime(anime: Animes): any;
    addAvaliacao(id: string, avaliacao: number): string;
    updateAnime(id: string, updatedData: Partial<Animes>): Animes;
    deleteAnime(id: string): string;
}
