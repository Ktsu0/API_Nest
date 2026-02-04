// src/serieFirebase/serieFirebase.module.ts
import { Module } from '@nestjs/common';
import { SerieFirebaseController } from './serieFirebase.controller';
import { SerieFirebaseService } from './serieFirebase.service';

// Módulo de domínio que usa Firestore via FirebaseService (global)
@Module({
  imports: [],
  controllers: [SerieFirebaseController],
  providers: [SerieFirebaseService],
  exports: [SerieFirebaseService],
})
export class SerieFirebaseModule {}
