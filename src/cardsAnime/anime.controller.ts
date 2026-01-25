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
import { CreateCard } from 'src/dtoCards/createCard';
import { UpdateCardDto } from 'src/dtoCards/updateCard';
import { IdParamDto } from 'src/dtoCards/idParam';
import { TemaParamDto } from 'src/dtoCards/temaParam';
import { JwtAutGuard } from 'src/users/guards/jwt-auth.guard';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { RolesG } from 'src/users/decorators/roles.decorator';
import { Roles } from 'src/users/model/roles.enum';

@Controller('animes')
export class AnimeController {
  constructor(private readonly animesService: AnimeService) {}

  @Get()
  async findAll(): Promise<any[]> {
    return this.animesService.findAll();
  }

  @Get('tema/:tema')
  async findTema(@Param('tema') params: TemaParamDto): Promise<any[]> {
    return this.animesService.findTema(params.tema);
  }

  @Get('ordem/alfabetica')
  async ordemAlfabetica(): Promise<any[]> {
    return this.animesService.ordemAlfabetica();
  }

  @Get('search')
  async findByTitle(@Query('q') q: string): Promise<any[]> {
    if (!q) {
      return this.animesService.findAll();
    }
    return this.animesService.findTitulo(q);
  }

  @Get(':id')
  async findOne(@Param() params: IdParamDto): Promise<any> {
    return this.animesService.findOne(params.id);
  }

  @UseGuards(JwtAutGuard, RolesGuard)
  @RolesG(Roles.ADMIN)
  @Post()
  addAnime(@Body() anime: CreateCard): any {
    return this.animesService.addAnime(anime);
  }

  @UseGuards(JwtAutGuard, RolesGuard)
  @Post(':id/avaliacao')
  async addAvaliacao(
    @Param('id') id: string,
    @Body('avaliacao') avaliacao: number,
  ): Promise<string> {
    await this.animesService.addAvaliacao(Number(id), avaliacao);
    return `Avaliação de ${avaliacao} adicionada à série com ID ${id}.`;
  }

  @UseGuards(JwtAutGuard, RolesGuard)
  @RolesG(Roles.ADMIN)
  @Put(':id')
  async updateAnime(
    @Param('id') id: string,
    @Body() updatedData: UpdateCardDto,
  ): Promise<any> {
    return this.animesService.updateAnime(Number(id), updatedData);
  }

  @UseGuards(JwtAutGuard, RolesGuard)
  @RolesG(Roles.ADMIN)
  @Delete(':id')
  async deleteAnime(@Param() params: IdParamDto): Promise<string> {
    return this.animesService.deleteAnime(params.id);
  }
}
