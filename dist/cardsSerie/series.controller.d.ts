import { SeriesService } from './series.service';
import { Serie } from '@prisma/client';
import { CreateCard } from 'src/dtoCards/createCard';
import { AvaliacaoDTO } from 'src/dtoCards/avaliacao';
import { UpdateCardDto } from 'src/dtoCards/updateCard';
import { IdParamDto } from 'src/dtoCards/idParam';
import { TemaParamDto } from 'src/dtoCards/temaParam';
export declare class SeriesController {
    private readonly seriesService;
    constructor(seriesService: SeriesService);
    findAll(): Promise<Serie[]>;
    findOne(params: IdParamDto): Promise<Serie>;
    findTema(params: TemaParamDto): Promise<Serie[]>;
    ordemAlfabetica(): Promise<Serie[]>;
    findByTitle(q: string): Promise<Serie[]>;
    addSerie(serie: CreateCard): any;
    addAvaliacao(id: string, avaliacaoDTO: AvaliacaoDTO): Promise<string>;
    updateSerie(id: string, updatedData: UpdateCardDto): Promise<Serie>;
    deleteSerie(params: IdParamDto): Promise<string>;
}
