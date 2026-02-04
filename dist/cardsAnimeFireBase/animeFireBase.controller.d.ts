import { AnimeService } from './animeFireBase.service';
import { CreateCard } from '../dtoCards/createCard';
import { UpdateCardDto } from '../dtoCards/updateCard';
import { IdParamDto } from '../dtoCards/idParam';
import { TemaParamDto } from '../dtoCards/temaParam';
export declare class AnimeController {
    private readonly animesService;
    constructor(animesService: AnimeService);
    findAll(): Promise<any[]>;
    findTema(params: TemaParamDto): Promise<any[]>;
    ordemAlfabetica(): Promise<any[]>;
    findByTitle(q: string): Promise<any[]>;
    findOne(params: IdParamDto): Promise<any>;
    addAnime(anime: CreateCard): any;
    addAvaliacao(id: string, avaliacao: number): Promise<string>;
    updateAnime(id: string, updatedData: UpdateCardDto): Promise<any>;
    deleteAnime(params: IdParamDto): Promise<string>;
}
