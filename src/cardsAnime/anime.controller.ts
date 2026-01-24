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

import { AnimeService } from './anime.service';
import { Serie } from '@prisma/client';
import { CreateCard } from 'src/dtoCards/createCard';
import { AvaliacaoDTO } from 'src/dtoCards/avaliacao';
import { UpdateCardDto } from 'src/dtoCards/updateCard';
import { IdParamDto } from 'src/dtoCards/idParam';
import { TemaParamDto } from 'src/dtoCards/temaParam';
import { JwtAutGuard } from 'src/users/guards/jwt-auth.guard';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { RolesG } from 'src/users/decorators/roles.decorator';
import { Roles } from 'src/users/model/roles.enum';

@UseGuards(JwtAutGuard, RolesGuard)
@Controller('animes')
export class AnimeController {
  constructor(private readonly animesService: AnimeService) {}

  @Get()
  async findAll(): Promise<Serie[]> {
    return this.animesService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: IdParamDto): Promise<Serie> {
    return this.animesService.findOne(params.id);
  }
  @Get('tema/:tema')
  async findTema(@Param('tema') params: TemaParamDto): Promise<Serie[]> {
    return this.animesService.findTema(params.tema);
  }
  @Get('ordem/alfabetica')
  async ordemAlfabetica(): Promise<Serie[]> {
    return this.animesService.ordemAlfabetica();
  }
  @Get('search')
  async findByTitle(@Query('q') q: string): Promise<Serie[]> {
    if (!q) {
      return this.animesService.findAll();
    }
    return this.animesService.findTitulo(q);
  }
  @RolesG(Roles.ADMIN)
  @Post()
  addAnime(@Body() anime: CreateCard): any {
    return this.animesService.addAnime(anime);
  }

  @Post(':id/avaliacao')
  async addAvaliacao(
    @Param('id') id: string,
    @Body('avaliacao') avaliacaoDTO: AvaliacaoDTO,
  ): Promise<string> {
    await this.animesService.addAvaliacao(Number(id), avaliacaoDTO.avaliacao);
    return `Avaliação de ${avaliacaoDTO.avaliacao} adicionada à série com ID ${id}.`;
  }

  @RolesG(Roles.ADMIN)
  @Put(':id')
  async updateAnime(
    @Param('id') id: string,
    @Body() updatedData: UpdateCardDto,
  ): Promise<Serie> {
    const anime = await this.animesService.updateAnime(Number(id), updatedData);
    return anime;
  }

  @RolesG(Roles.ADMIN)
  @Delete(':id')
  async deleteAnime(@Param() params: IdParamDto): Promise<string> {
    return this.animesService.deleteAnime(params.id);
  }
}
