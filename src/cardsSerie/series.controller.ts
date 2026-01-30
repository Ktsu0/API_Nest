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
import { CreateCard } from '../dtoCards/createCard';
import { UpdateCardDto } from '../dtoCards/updateCard';
import { IdParamDto } from '../dtoCards/idParam';
import { TemaParamDto } from '../dtoCards/temaParam';
import { JwtAutGuard } from '../users/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/model/roles.enum';
import { RolesG } from '../users/decorators/roles.decorator';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  async findAll(): Promise<any[]> {
    return this.seriesService.findAll();
  }

  @Get('tema/:tema')
  async findTema(@Param('tema') params: TemaParamDto): Promise<any[]> {
    return this.seriesService.findTema(params.tema);
  }

  @Get('ordem/alfabetica')
  async ordemAlfabetica(): Promise<any[]> {
    return this.seriesService.ordemAlfabetica();
  }

  @Get('search')
  async findByTitle(@Query('q') q: string): Promise<any[]> {
    if (!q) {
      return this.seriesService.findAll();
    }
    return this.seriesService.findTitulo(q);
  }

  @Get(':id')
  async findOne(@Param() params: IdParamDto): Promise<any> {
    return this.seriesService.findOne(params.id);
  }

  @UseGuards(JwtAutGuard, RolesGuard)
  @RolesG(Roles.ADMIN)
  @Post()
  addSerie(@Body() serie: CreateCard): any {
    return this.seriesService.addSerie(serie);
  }

  @UseGuards(JwtAutGuard, RolesGuard)
  @Post(':id/avaliacao')
  async addAvaliacao(
    @Param('id') id: string,
    @Body('avaliacao') avaliacao: number,
  ): Promise<string> {
    await this.seriesService.addAvaliacao(Number(id), avaliacao);
    return `Avaliação de ${avaliacao} adicionada à série com ID ${id}.`;
  }

  @UseGuards(JwtAutGuard, RolesGuard)
  @RolesG(Roles.ADMIN)
  @Put(':id')
  async updateSerie(
    @Param('id') id: string,
    @Body() updatedData: UpdateCardDto,
  ): Promise<any> {
    return this.seriesService.updateSerie(Number(id), updatedData);
  }

  @UseGuards(JwtAutGuard, RolesGuard)
  @RolesG(Roles.ADMIN)
  @Delete(':id')
  async deleteSerie(@Param() params: IdParamDto): Promise<string> {
    return this.seriesService.deleteSerie(params.id);
  }
}
