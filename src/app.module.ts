// src/app.module.ts (Atualizado)
import { Module } from '@nestjs/common';
import { SeriesModule } from './cardsSerie/serie.module';
import { AppController } from './app.controller';
import { UserModule } from './users/users.module';
import { CarrinhoModule } from './carrinho/carrinho.module';

@Module({
  imports: [SeriesModule, UserModule, CarrinhoModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
