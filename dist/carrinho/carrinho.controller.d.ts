import { CarrinhoService } from './carrinho.service';
import { CarInput } from './../dto/carrinho/carInput';
import { CarValidacao } from './../dto/carrinho/carValid';
export declare class CarrinhoController {
    private readonly carrinhoService;
    constructor(carrinhoService: CarrinhoService);
    validarCarrinho(itensCarrinho: CarInput[]): CarValidacao;
    finalizarCompra(itensCarrinho: CarInput[]): string[];
}
