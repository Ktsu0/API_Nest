import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firestore!: FirebaseFirestore.Firestore;

  onModuleInit() {
    if (admin.apps.length === 0) {
      console.log(
        '[FirebaseService] Inicializando com ProjectID:',
        process.env.FIREBASE_PROJECT_ID,
      );
      console.log(
        '[FirebaseService] Client Email:',
        process.env.FIREBASE_CLIENT_EMAIL,
      );
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }

    this.firestore = admin.firestore();
    this.firestore.settings({ ignoreUndefinedProperties: true });
  }

  // Getter público tipado
  get db(): FirebaseFirestore.Firestore {
    return this.firestore;
  }
}
