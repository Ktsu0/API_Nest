// src/app.module.ts (Atualizado)
import { Module } from '@nestjs/common';
import { SeriesModule } from './cardsSerie/serie.module';
import { AppController } from './app.controller';
import { UserModule } from './users/users.module';

@Module({
  imports: [SeriesModule, UserModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
