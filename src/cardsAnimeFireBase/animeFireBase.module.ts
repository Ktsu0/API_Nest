// src/series/series.module.ts
import { Module } from '@nestjs/common';
import { AnimeController } from './animeFireBase.controller';
import { AnimeService } from './animeFireBase.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [AnimeController],
  providers: [AnimeService, PrismaService],

  exports: [AnimeService],
})
export class AnimeModule {}
