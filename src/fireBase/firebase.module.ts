import { Global, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

// Módulo global para expor Firebase em toda a aplicação via DI
@Global()
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
