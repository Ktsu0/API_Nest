import { AnimeService } from './anime.service';
import { Serie } from '@prisma/client';
import { CreateCard } from 'src/dtoCards/createCard';
import { AvaliacaoDTO } from 'src/dtoCards/avaliacao';
import { UpdateCardDto } from 'src/dtoCards/updateCard';
import { IdParamDto } from 'src/dtoCards/idParam';
import { TemaParamDto } from 'src/dtoCards/temaParam';
export declare class AnimeController {
    private readonly animesService;
    constructor(animesService: AnimeService);
    findAll(): Promise<Serie[]>;
    findOne(params: IdParamDto): Promise<Serie>;
    findTema(params: TemaParamDto): Promise<Serie[]>;
    ordemAlfabetica(): Promise<Serie[]>;
    findByTitle(q: string): Promise<Serie[]>;
    addAnime(anime: CreateCard): any;
    addAvaliacao(id: string, avaliacaoDTO: AvaliacaoDTO): Promise<string>;
    updateAnime(id: string, updatedData: UpdateCardDto): Promise<Serie>;
    deleteAnime(params: IdParamDto): Promise<string>;
}
