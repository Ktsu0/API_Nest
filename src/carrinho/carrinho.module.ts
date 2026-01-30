// src/series/series.module.ts
import { Module } from '@nestjs/common';
import { CarrinhoController } from './carrinho.controller';
import { CarrinhoService } from './carrinho.service';
import { SeriesModule } from '../cardsSerie/serie.module';
import { AnimeModule } from '../cardsAnime/anime.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [AnimeModule, SeriesModule],
  controllers: [CarrinhoController],
  providers: [CarrinhoService, PrismaService],
})
export class CarrinhoModule {}
