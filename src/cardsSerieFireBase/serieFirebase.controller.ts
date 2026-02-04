// src/serieFirebase/serieFirebase.controller.ts
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
  Req,
} from '@nestjs/common';
import { SerieFirebaseService } from './serieFirebase.service';
import { CreateCard } from '../dtoCardsFireBase/createCard';
import { UpdateCardDto } from '../dtoCardsFireBase/updateCard';
import { IdParamDto } from '../dtoCardsFireBase/idParam';
import { TemaParamDto } from '../dtoCardsFireBase/temaParam';
import { JwtAutGuard } from '../users/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/model/roles.enum';
import { RolesG } from '../users/decorators/roles.decorator';

// Controller HTTP exclusivo para implementação Firestore
@Controller('serieFirebase')
export class SerieFirebaseController {
  constructor(private readonly serieService: SerieFirebaseService) {}

  @Get()
  async findAll(): Promise<any[]> {
    return this.serieService.findAll();
  }

  @Get('tema/:tema')
  async findTema(@Param('tema') params: TemaParamDto): Promise<any[]> {
    return this.serieService.findTema(params.tema);
  }

  @Get('ordem/alfabetica')
  async ordemAlfabetica(): Promise<any[]> {
    return this.serieService.ordemAlfabetica();
  }

  @Get('search')
  async findByTitle(@Query('q') q: string): Promise<any[]> {
    if (!q) {
      return this.serieService.findAll();
    }

    return this.serieService.findTitulo(q);
  }

  @Get(':id')
  async findOne(@Param() params: IdParamDto): Promise<any> {
    return this.serieService.findOne(params.id);
  }

  @UseGuards(JwtAutGuard, RolesGuard)
  @RolesG(Roles.ADMIN)
  @Post()
  addSerie(@Req() req, @Body() serie: CreateCard): Promise<any> {
    console.log(
      '[SerieFirebaseController] Adicionando série:',
      JSON.stringify(serie),
    );
    console.log('[SerieFirebaseController] Por usuário:', req.user?.email);
    return this.serieService.addSerie(serie);
  }

  @UseGuards(JwtAutGuard, RolesGuard)
  @Post(':id/avaliacao')
  async addAvaliacao(
    @Param('id') id: string,
    @Body('avaliacao') avaliacao: number,
  ): Promise<string> {
    await this.serieService.addAvaliacao(id, avaliacao);

    return `Avaliação de ${avaliacao} adicionada à série com ID ${id}.`;
  }

  @UseGuards(JwtAutGuard, RolesGuard)
  @RolesG(Roles.ADMIN)
  @Put(':id')
  async updateSerie(
    @Param('id') id: string,
    @Body() updatedData: UpdateCardDto,
  ): Promise<any> {
    return this.serieService.updateSerie(id, updatedData);
  }

  @UseGuards(JwtAutGuard, RolesGuard)
  @RolesG(Roles.ADMIN)
  @Delete(':id')
  async deleteSerie(@Param() params: IdParamDto): Promise<string> {
    return this.serieService.deleteSerie(params.id);
  }
}
