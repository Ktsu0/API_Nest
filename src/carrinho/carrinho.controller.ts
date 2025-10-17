import { Controller, Post, Body } from '@nestjs/common';
import { CarrinhoService } from './carrinho.service';
import type {
  CarrinhoInputItem,
  CarrinhoValidacao,
} from './models/carrinho.model';

@Controller('series/carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}
  @Post('validar')
  validarCarrinho(
    @Body() itensCarrinho: CarrinhoInputItem[],
  ): CarrinhoValidacao {
    return this.carrinhoService.validarCarrinho(itensCarrinho);
  }
  @Post('comprar')
  finalizarCompra(@Body() itensCarrinho: CarrinhoInputItem[]): string[] {
    return this.carrinhoService.finalizarCompra(itensCarrinho);
  }
}
