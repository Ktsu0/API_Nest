// src/series/series.module.ts
import { Module } from '@nestjs/common';
import { AnimeController } from './anime.controller';
import { AnimeService } from './anime.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [AnimeController],
  providers: [AnimeService, PrismaService],

  exports: [AnimeService],
})
export class AnimeModule {}
