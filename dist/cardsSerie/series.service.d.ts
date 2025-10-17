import { Serie } from './models/series.model';
export declare class SeriesService {
    private series;
    findAll(): Serie[];
    findOne(id: string): Serie;
    findTema(tema: string): Serie[];
    private normalize;
    addSerie(serie: Serie): Serie;
    updateImage(id: string, novaImagem: string): Serie;
    ordemAlfabetica(): Serie[];
    addAvaliacao(id: string, avaliacao: number): void;
    findTitulo(searchTerm: string): Serie[];
    updateSerie(id: string, updatedData: Partial<Serie>): Serie;
    deleteSerie(id: string): string;
    atualizarEstoque(id: string, quantidade: number): void;
}
