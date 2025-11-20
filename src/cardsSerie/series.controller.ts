import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Query,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { SeriesService } from './series.service';
import type { Serie } from 'src/model/series.model';
import { CreateCard } from 'src/dtoCards/createCard';
import { AvaliacaoDTO } from 'src/dtoCards/avaliacao';
import { UpdateCardDto } from 'src/dtoCards/updateCard';
import { IdParamDto } from 'src/dtoCards/idParam';
import { TemaParamDto } from 'src/dtoCards/temaParam';
import { JwtAutGuard } from 'src/users/guards/jwt-auth.guard';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { Roles } from 'src/users/model/roles.enum';
import { RolesG } from 'src/users/decorators/roles.decorator';

@UseGuards(JwtAutGuard, RolesGuard)
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  findAll(): Serie[] {
    return this.seriesService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto): Serie {
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

  @RolesG(Roles.ADMIN)
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

  @RolesG(Roles.ADMIN)
  @Put(':id')
  updateSerie(
    @Param('id') id: string,
    @Body() updatedData: UpdateCardDto,
  ): Serie {
    const serie = this.seriesService.updateSerie(id, updatedData);
    return serie;
  }

  @RolesG(Roles.ADMIN)
  @Delete(':id')
  deleteSerie(@Param() params: IdParamDto): string {
    return this.seriesService.deleteSerie(params.id);
  }
}
