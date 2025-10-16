import { SeriesService } from './series.service';
import type { Serie } from './models/series.model';
export declare class SeriesController {
    private readonly seriesService;
    constructor(seriesService: SeriesService);
    findAll(): Serie[];
    findOne(id: string): Serie;
    findTema(tema: string): Serie[];
    ordemAlfabetica(): Serie[];
    findByTitle(q: string): Serie[];
    addSerie(serie: Serie): any;
    addAvaliacao(id: string, avaliacao: number): string;
    updateSerie(id: string, updatedData: Partial<Serie>): Serie;
    deleteSerie(id: string): string;
}
