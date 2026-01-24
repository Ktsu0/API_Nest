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
import { Serie } from '@prisma/client';
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
  async findAll(): Promise<Serie[]> {
    return this.seriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: IdParamDto): Promise<Serie> {
    return this.seriesService.findOne(params.id);
  }

  @Get('tema/:tema')
  async findTema(@Param('tema') params: TemaParamDto): Promise<Serie[]> {
    return this.seriesService.findTema(params.tema);
  }

  @Get('ordem/alfabetica')
  async ordemAlfabetica(): Promise<Serie[]> {
    return this.seriesService.ordemAlfabetica();
  }

  @Get('search')
  async findByTitle(@Query('q') q: string): Promise<Serie[]> {
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
  async addAvaliacao(
    @Param('id') id: string,
    @Body('avaliacao') avaliacaoDTO: AvaliacaoDTO,
  ): Promise<string> {
    await this.seriesService.addAvaliacao(Number(id), avaliacaoDTO.avaliacao);
    return `Avaliação de ${avaliacaoDTO.avaliacao} adicionada à série com ID ${id}.`;
  }

  @RolesG(Roles.ADMIN)
  @Put(':id')
  async updateSerie(
    @Param('id') id: string,
    @Body() updatedData: UpdateCardDto,
  ): Promise<Serie> {
    const serie = await this.seriesService.updateSerie(Number(id), updatedData);
    return serie;
  }

  @RolesG(Roles.ADMIN)
  @Delete(':id')
  async deleteSerie(@Param() params: IdParamDto): Promise<string> {
    return this.seriesService.deleteSerie(params.id);
  }
}
