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

@Controller('animes')
export class AnimeController {
  constructor(private readonly animesService: AnimeService) {}

  @Get()
  findAll(): Animes[] {
    return this.animesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Animes {
    return this.animesService.findOne(id);
  }
  @Get('tema/:tema')
  findTema(@Param('tema') tema: string): Animes[] {
    return this.animesService.findTema(tema);
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
  addAnime(@Body() anime: Animes): any {
    return this.animesService.addAnime(anime);
  }

  @Post(':id/avaliacao')
  addAvaliacao(
    @Param('id') id: string,
    @Body('avaliacao') avaliacao: number,
  ): string {
    this.animesService.addAvaliacao(id, avaliacao);
    return `Avaliação de ${avaliacao} adicionada à série com ID ${id}.`;
  }

  @Put(':id')
  updateAnime(
    @Param('id') id: string,
    @Body() updatedData: Partial<Animes>,
  ): Animes {
    const anime = this.animesService.updateAnime(id, updatedData);
    return anime;
  }

  @Delete(':id')
  deleteAnime(@Param('id') id: string): string {
    return this.animesService.deleteAnime(id);
  }
}
