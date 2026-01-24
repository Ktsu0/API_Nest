import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CarrinhoService } from './carrinho.service';
import { CarInput } from './dto/carInput';
import { CarValidacao } from './dto/carValid';
import { JwtAutGuard } from 'src/users/guards/jwt-auth.guard';

@UseGuards(JwtAutGuard)
@Controller('carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  @Post('validar')
  async validarCarrinho(
    @Body() itensCarrinho: CarInput[],
  ): Promise<CarValidacao> {
    return this.carrinhoService.validarCarrinho(itensCarrinho);
  }

  @Post('comprar')
  async finalizarCompra(@Body() itensCarrinho: CarInput[]): Promise<string[]> {
    return this.carrinhoService.finalizarCompra(itensCarrinho);
  }
}
