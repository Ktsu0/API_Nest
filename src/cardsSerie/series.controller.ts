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
import { CreateCard } from 'src/dto/cards/createCard';
import { AvaliacaoDTO } from 'src/dto/cards/avaliacao';
import { UpdateCardDto } from 'src/dto/cards/updateCard';
import { IdParamDto } from 'src/dto/cards/idParam';
import { TemaParamDto } from 'src/dto/cards/temaParam';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  findAll(): Serie[] {
    return this.seriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') params: IdParamDto): Serie {
    return this.seriesService.findOne(params.id);
  }
  @Get('tema/:tema')
  findTema(@Param('tema') params: TemaParamDto): Serie[] {
    return this.seriesService.findTema(params.tema);
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
  addSerie(@Body() serie: CreateCard): any {
    return this.seriesService.addSerie(serie);
  }

  @Post(':id/avaliacao')
  addAvaliacao(
    @Param('id') id: string,
    @Body('avaliacao') avaliacaoDTO: AvaliacaoDTO,
  ): string {
    this.seriesService.addAvaliacao(id, avaliacaoDTO.avaliacao);
    return `Avaliação de ${avaliacaoDTO.avaliacao} adicionada à série com ID ${id}.`;
  }

  @Put(':id')
  updateSerie(
    @Param('id') id: string,
    @Body() updatedData: UpdateCardDto,
  ): Serie {
    const serie = this.seriesService.updateSerie(id, updatedData);
    return serie;
  }

  @Delete(':id')
  deleteSerie(@Param('id') params: IdParamDto): string {
    return this.seriesService.deleteSerie(params.id);
  }
}
