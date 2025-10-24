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

import { AnimeService } from './anime.service';
import type { Animes } from './models/animes.model';
import { CreateCard } from 'src/dto/cards/createCard';
import { AvaliacaoDTO } from 'src/dto/cards/avaliacao';
import { UpdateCardDto } from 'src/dto/cards/updateCard';
import { IdParamDto } from 'src/dto/cards/idParam';
import { TemaParamDto } from 'src/dto/cards/temaParam';

@Controller('animes')
export class AnimeController {
  constructor(private readonly animesService: AnimeService) {}

  @Get()
  findAll(): Animes[] {
    return this.animesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') params: IdParamDto): Animes {
    return this.animesService.findOne(params.id);
  }
  @Get('tema/:tema')
  findTema(@Param('tema') params: TemaParamDto): Animes[] {
    return this.animesService.findTema(params.tema);
  }
  @Get('ordem/alfabetica')
  ordemAlfabetica(): Animes[] {
    return this.animesService.ordemAlfabetica();
  }
  @Get('search')
  findByTitle(@Query('q') q: string): Animes[] {
    if (!q) {
      return this.animesService.findAll();
    }
    return this.animesService.findTitulo(q);
  }
  @Post()
  addAnime(@Body() anime: CreateCard): any {
    return this.animesService.addAnime(anime);
  }

  @Post(':id/avaliacao')
  addAvaliacao(
    @Param('id') id: string,
    @Body('avaliacao') avaliacaoDTO: AvaliacaoDTO,
  ): string {
    this.animesService.addAvaliacao(id, avaliacaoDTO.avaliacao);
    return `Avaliação de ${avaliacaoDTO.avaliacao} adicionada à série com ID ${id}.`;
  }

  @Put(':id')
  updateAnime(
    @Param('id') id: string,
    @Body() updatedData: UpdateCardDto,
  ): Animes {
    const anime = this.animesService.updateAnime(id, updatedData);
    return anime;
  }

  @Delete(':id')
  deleteAnime(@Param('id') params: IdParamDto): string {
    return this.animesService.deleteAnime(params.id);
  }
}
