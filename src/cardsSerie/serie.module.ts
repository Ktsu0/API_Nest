// src/series/series.module.ts
import { Module } from '@nestjs/common';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [SeriesController],
  providers: [SeriesService, PrismaService],

  exports: [SeriesService],
})
export class SeriesModule {}
