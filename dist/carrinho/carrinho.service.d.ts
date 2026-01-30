import { PrismaService } from '../prisma.service';
import { CarrinhoValidacao, CarrinhoInputItem } from './models/carrinho.model';
export declare class CarrinhoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validarCarrinho(itensCarrinho: CarrinhoInputItem[]): Promise<CarrinhoValidacao>;
    finalizarCompra(itensCarrinho: CarrinhoInputItem[]): Promise<string[]>;
}
