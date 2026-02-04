// src/app.module.ts (Atualizado)
import { Module } from '@nestjs/common';
import { SeriesModule } from './cardsSerie/serie.module';
import { AppController } from './app.controller';
import { UserModule } from './users/users.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
import { AnimeModule } from './cardsAnime/anime.module';
import { PrismaService } from './prisma.service';
import { SerieFirebaseModule } from './cardsSerieFireBase/serieFirebase.module';
import { FirebaseModule } from './fireBase/firebase.module';

@Module({
  imports: [
    SeriesModule,
    UserModule,
    CarrinhoModule,
    AnimeModule,
    SerieFirebaseModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
