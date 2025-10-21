import { Animes } from './models/animes.model';
export declare class AnimeService {
    private Animes;
    findAll(): Animes[];
    findOne(id: string): Animes;
    findTema(tema: string): Animes[];
    private normalize;
    addAnime(Anime: Animes): Animes;
    updateImage(id: string, novaImagem: string): Animes;
    ordemAlfabetica(): Animes[];
    addAvaliacao(id: string, avaliacao: number): void;
    findTitulo(searchTerm: string): Animes[];
    updateAnime(id: string, updatedData: Partial<Animes>): Animes;
    deleteAnime(id: string): string;
    atualizarEstoque(id: string, quantidade: number): void;
}
