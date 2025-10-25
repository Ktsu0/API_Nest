import { SeriesService } from './../cardsSerie/series.service';
import { AnimeService } from './../cardsAnime/anime.service';
import { CarrinhoValidacao, CarrinhoInputItem } from './models/carrinho.model';
export declare class CarrinhoService {
    private readonly seriesService;
    private readonly animesService;
    constructor(seriesService: SeriesService, animesService: AnimeService);
    validarCarrinho(itensCarrinho: CarrinhoInputItem[]): CarrinhoValidacao;
    finalizarCompra(itensCarrinho: CarrinhoInputItem[]): string[];
}
