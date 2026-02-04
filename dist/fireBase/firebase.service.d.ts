import { OnModuleInit } from '@nestjs/common';
export declare class FirebaseService implements OnModuleInit {
    private firestore;
    onModuleInit(): void;
    get db(): FirebaseFirestore.Firestore;
}
