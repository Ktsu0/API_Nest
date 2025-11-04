import { AnimeService } from './anime.service';
import type { Animes } from './models/animes.model';
import { CreateCard } from 'src/dtoCards/createCard';
import { AvaliacaoDTO } from 'src/dtoCards/avaliacao';
import { UpdateCardDto } from 'src/dtoCards/updateCard';
import { IdParamDto } from 'src/dtoCards/idParam';
import { TemaParamDto } from 'src/dtoCards/temaParam';
export declare class AnimeController {
    private readonly animesService;
    constructor(animesService: AnimeService);
    findAll(): Animes[];
    findOne(params: IdParamDto): Animes;
    findTema(params: TemaParamDto): Animes[];
    ordemAlfabetica(): Animes[];
    findByTitle(q: string): Animes[];
    addAnime(anime: CreateCard): any;
    addAvaliacao(id: string, avaliacaoDTO: AvaliacaoDTO): string;
    updateAnime(id: string, updatedData: UpdateCardDto): Animes;
    deleteAnime(params: IdParamDto): string;
}
