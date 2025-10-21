// src/series/series.module.ts
import { Module } from '@nestjs/common';
import { CarrinhoController } from './carrinho.controller';
import { CarrinhoService } from './carrinho.service';
import { SeriesModule } from 'src/cardsSerie/serie.module';
import { AnimeModule } from 'src/cardsAnime/anime.module';

@Module({
  imports: [AnimeModule, SeriesModule],
  controllers: [CarrinhoController],
  providers: [CarrinhoService],
})
export class CarrinhoModule {}
