import { AnimeService } from './anime.service';
import type { Animes } from './models/animes.model';
import { CreateCard } from 'src/dto/cards/createCard';
import { AvaliacaoDTO } from 'src/dto/cards/avaliacao';
import { UpdateCardDto } from 'src/dto/cards/updateCard';
import { IdParamDto } from 'src/dto/cards/idParam';
import { TemaParamDto } from 'src/dto/cards/temaParam';
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
