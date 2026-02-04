import { SerieFirebaseService } from './serieFirebase.service';
import { CreateCard } from '../dtoCardsFireBase/createCard';
import { UpdateCardDto } from '../dtoCardsFireBase/updateCard';
import { IdParamDto } from '../dtoCardsFireBase/idParam';
import { TemaParamDto } from '../dtoCardsFireBase/temaParam';
export declare class SerieFirebaseController {
    private readonly serieService;
    constructor(serieService: SerieFirebaseService);
    findAll(): Promise<any[]>;
    findTema(params: TemaParamDto): Promise<any[]>;
    ordemAlfabetica(): Promise<any[]>;
    findByTitle(q: string): Promise<any[]>;
    findOne(params: IdParamDto): Promise<any>;
    addSerie(serie: CreateCard): Promise<any>;
    addAvaliacao(id: string, avaliacao: number): Promise<string>;
    updateSerie(id: string, updatedData: UpdateCardDto): Promise<any>;
    deleteSerie(params: IdParamDto): Promise<string>;
}
