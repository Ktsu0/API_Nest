// src/series/series.module.ts
import { Module } from '@nestjs/common';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';

@Module({
  imports: [],
  controllers: [SeriesController],
  providers: [SeriesService],

  exports: [SeriesService],
})
export class SeriesModule {}
