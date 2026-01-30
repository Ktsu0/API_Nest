import { SeriesService } from './series.service';
import { CreateCard } from '../dtoCards/createCard';
import { UpdateCardDto } from '../dtoCards/updateCard';
import { IdParamDto } from '../dtoCards/idParam';
import { TemaParamDto } from '../dtoCards/temaParam';
export declare class SeriesController {
    private readonly seriesService;
    constructor(seriesService: SeriesService);
    findAll(): Promise<any[]>;
    findTema(params: TemaParamDto): Promise<any[]>;
    ordemAlfabetica(): Promise<any[]>;
    findByTitle(q: string): Promise<any[]>;
    findOne(params: IdParamDto): Promise<any>;
    addSerie(serie: CreateCard): any;
    addAvaliacao(id: string, avaliacao: number): Promise<string>;
    updateSerie(id: string, updatedData: UpdateCardDto): Promise<any>;
    deleteSerie(params: IdParamDto): Promise<string>;
}
