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
import type { Serie } from 'src/model/series.model';
import { CreateCard } from 'src/dtoCards/createCard';
import { AvaliacaoDTO } from 'src/dtoCards/avaliacao';
import { UpdateCardDto } from 'src/dtoCards/updateCard';
import { IdParamDto } from 'src/dtoCards/idParam';
import { TemaParamDto } from 'src/dtoCards/temaParam';
import { JwtAutGuard } from 'src/users/guards/jwt-auth.guard';

@UseGuards(JwtAutGuard)
@Controller('animes')
export class AnimeController {
  constructor(private readonly animesService: AnimeService) {}

  @Get()
  findAll(): Serie[] {
    return this.animesService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto): Serie {
    return this.animesService.findOne(params.id);
  }
  @Get('tema/:tema')
  findTema(@Param('tema') params: TemaParamDto): Serie[] {
    return this.animesService.findTema(params.tema);
  }
  @Get('ordem/alfabetica')
  ordemAlfabetica(): Serie[] {
    return this.animesService.ordemAlfabetica();
  }
  @Get('search')
  findByTitle(@Query('q') q: string): Serie[] {
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
  ): Serie {
    const anime = this.animesService.updateAnime(id, updatedData);
    return anime;
  }

  @Delete(':id')
  deleteAnime(@Param() params: IdParamDto): string {
    return this.animesService.deleteAnime(params.id);
  }
}
