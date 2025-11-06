import { SeriesService } from './series.service';
import type { Serie } from 'src/model/series.model';
import { CreateCard } from 'src/dtoCards/createCard';
import { AvaliacaoDTO } from 'src/dtoCards/avaliacao';
import { UpdateCardDto } from 'src/dtoCards/updateCard';
import { IdParamDto } from 'src/dtoCards/idParam';
import { TemaParamDto } from 'src/dtoCards/temaParam';
export declare class SeriesController {
    private readonly seriesService;
    constructor(seriesService: SeriesService);
    findAll(): Serie[];
    findOne(params: IdParamDto): Serie;
    findTema(params: TemaParamDto): Serie[];
    ordemAlfabetica(): Serie[];
    findByTitle(q: string): Serie[];
    addSerie(serie: CreateCard): any;
    addAvaliacao(id: string, avaliacaoDTO: AvaliacaoDTO): string;
    updateSerie(id: string, updatedData: UpdateCardDto): Serie;
    deleteSerie(params: IdParamDto): string;
}
