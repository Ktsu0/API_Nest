import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Query,
  Put,
  Delete,
} from '@nestjs/common';

import { SeriesService } from './series.service';
import type { Serie } from './models/series.model';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  findAll(): Serie[] {
    return this.seriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Serie {
    return this.seriesService.findOne(id);
  }
  @Get('tema/:tema')
  findTema(@Param('tema') tema: string): Serie[] {
    return this.seriesService.findTema(tema);
  }
  @Get('ordem/alfabetica')
  ordemAlfabetica(): Serie[] {
    return this.seriesService.ordemAlfabetica();
  }
  @Get('search')
  findByTitle(@Query('q') q: string): Serie[] {
    if (!q) {
      return this.seriesService.findAll();
    }
    return this.seriesService.findTitulo(q);
  }
  @Post()
  addSerie(@Body() serie: Serie): any {
    return this.seriesService.addSerie(serie);
  }

  @Post(':id/avaliacao')
  addAvaliacao(
    @Param('id') id: string,
    @Body('avaliacao') avaliacao: number,
  ): string {
    this.seriesService.addAvaliacao(id, avaliacao);
    return `Avaliação de ${avaliacao} adicionada à série com ID ${id}.`;
  }

  @Put(':id')
  updateSerie(
    @Param('id') id: string,
    @Body() updatedData: Partial<Serie>,
  ): Serie {
    const serie = this.seriesService.updateSerie(id, updatedData);
    return serie;
  }

  @Delete(':id')
  deleteSerie(@Param('id') id: string): string {
    return this.seriesService.deleteSerie(id);
  }
}
