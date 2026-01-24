import { CarrinhoService } from './carrinho.service';
import { CarInput } from './dto/carInput';
import { CarValidacao } from './dto/carValid';
export declare class CarrinhoController {
    private readonly carrinhoService;
    constructor(carrinhoService: CarrinhoService);
    validarCarrinho(itensCarrinho: CarInput[]): Promise<CarValidacao>;
    finalizarCompra(itensCarrinho: CarInput[]): Promise<string[]>;
}
