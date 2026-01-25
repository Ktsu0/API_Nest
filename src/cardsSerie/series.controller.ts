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
import { CreateCard } from 'src/dtoCards/createCard';
import { UpdateCardDto } from 'src/dtoCards/updateCard';
import { IdParamDto } from 'src/dtoCards/idParam';
import { TemaParamDto } from 'src/dtoCards/temaParam';
import { JwtAutGuard } from 'src/users/guards/jwt-auth.guard';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { Roles } from 'src/users/model/roles.enum';
import { RolesG } from 'src/users/decorators/roles.decorator';

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
