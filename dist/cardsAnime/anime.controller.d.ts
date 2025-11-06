import { AnimeService } from './anime.service';
import type { Serie } from 'src/model/series.model';
import { CreateCard } from 'src/dtoCards/createCard';
import { AvaliacaoDTO } from 'src/dtoCards/avaliacao';
import { UpdateCardDto } from 'src/dtoCards/updateCard';
import { IdParamDto } from 'src/dtoCards/idParam';
import { TemaParamDto } from 'src/dtoCards/temaParam';
export declare class AnimeController {
    private readonly animesService;
    constructor(animesService: AnimeService);
    findAll(): Serie[];
    findOne(params: IdParamDto): Serie;
    findTema(params: TemaParamDto): Serie[];
    ordemAlfabetica(): Serie[];
    findByTitle(q: string): Serie[];
    addAnime(anime: CreateCard): any;
    addAvaliacao(id: string, avaliacaoDTO: AvaliacaoDTO): string;
    updateAnime(id: string, updatedData: UpdateCardDto): Serie;
    deleteAnime(params: IdParamDto): string;
}
