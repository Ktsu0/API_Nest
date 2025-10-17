import { SeriesService } from 'src/cardsSerie/series.service';
import { CarrinhoValidacao, CarrinhoInputItem } from './models/carrinho.model';
export declare class CarrinhoService {
    private readonly seriesService;
    constructor(seriesService: SeriesService);
    validarCarrinho(itensCarrinho: CarrinhoInputItem[]): CarrinhoValidacao;
    finalizarCompra(itensCarrinho: CarrinhoInputItem[]): string[];
}
