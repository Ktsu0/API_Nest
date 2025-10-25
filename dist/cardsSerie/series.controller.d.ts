import { SeriesService } from './series.service';
import type { Serie } from './models/series.model';
import { CreateCard } from 'src/dto/cards/createCard';
import { AvaliacaoDTO } from 'src/dto/cards/avaliacao';
import { UpdateCardDto } from 'src/dto/cards/updateCard';
import { IdParamDto } from 'src/dto/cards/idParam';
import { TemaParamDto } from 'src/dto/cards/temaParam';
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
