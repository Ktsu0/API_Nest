// src/series/series.module.ts
import { Module } from '@nestjs/common';
import { AnimeController } from './anime.controller';
import { AnimeService } from './anime.service';

@Module({
  imports: [],
  controllers: [AnimeController],
  providers: [AnimeService],

  exports: [AnimeService],
})
export class AnimeModule {}
