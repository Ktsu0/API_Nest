import { Serie } from 'src/model/series.model';
export declare class AnimeService {
    private Animes;
    findAll(): Serie[];
    findOne(id: string): Serie;
    findTema(tema: string): Serie[];
    private normalize;
    addAnime(Anime: Serie): Serie;
    updateImage(id: string, novaImagem: string): Serie;
    ordemAlfabetica(): Serie[];
    addAvaliacao(id: string, avaliacao: number): void;
    findTitulo(searchTerm: string): Serie[];
    updateAnime(id: string, updatedData: Partial<Serie>): Serie;
    deleteAnime(id: string): string;
    atualizarEstoque(id: string, quantidade: number): void;
}
