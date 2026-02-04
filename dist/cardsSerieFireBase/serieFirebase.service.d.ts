import { FirebaseService } from '../fireBase/firebase.service';
import { Serie } from '../model/series.model';
export declare class SerieFirebaseService {
    private readonly firebase;
    constructor(firebase: FirebaseService);
    private get collection();
    private normalize;
    private formatSerie;
    private mapFirestoreSerie;
    findAll(): Promise<Serie[]>;
    findOne(id: string): Promise<Serie>;
    findTema(tema: string): Promise<Serie[]>;
    findTitulo(searchTerm: string): Promise<Serie[]>;
    addSerie(data: any): Promise<Serie>;
    updateSerie(id: string, updatedData: any): Promise<Serie>;
    deleteSerie(id: string): Promise<string>;
    addAvaliacao(id: string, avaliacao: number): Promise<string>;
    atualizarEstoque(id: string, quantidade: number): Promise<Serie>;
    ordemAlfabetica(): Promise<Serie[]>;
}
