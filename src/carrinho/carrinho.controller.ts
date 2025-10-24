import { Controller, Post, Body } from '@nestjs/common';
import { CarrinhoService } from './carrinho.service';
import { CarInput } from './../dto/carrinho/carInput';
import { CarValidacao } from './../dto/carrinho/carValid';

@Controller('series/carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}
  @Post('validar')
  validarCarrinho(@Body() itensCarrinho: CarInput[]): CarValidacao {
    return this.carrinhoService.validarCarrinho(itensCarrinho);
  }
  @Post('comprar')
  finalizarCompra(@Body() itensCarrinho: CarInput[]): string[] {
    return this.carrinhoService.finalizarCompra(itensCarrinho);
  }
}
