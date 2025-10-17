import { CarrinhoService } from './carrinho.service';
import type { CarrinhoInputItem, CarrinhoValidacao } from './models/carrinho.model';
export declare class CarrinhoController {
    private readonly carrinhoService;
    constructor(carrinhoService: CarrinhoService);
    validarCarrinho(itensCarrinho: CarrinhoInputItem[]): CarrinhoValidacao;
    finalizarCompra(itensCarrinho: CarrinhoInputItem[]): string[];
}
