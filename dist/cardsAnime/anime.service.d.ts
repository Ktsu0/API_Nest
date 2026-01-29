import { PrismaService } from 'src/prisma.service';
export declare class AnimeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private normalize;
    private formatAnime;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    findTema(tema: string): Promise<any[]>;
    findTitulo(searchTerm: string): Promise<any[]>;
    addAvaliacao(id: number, avaliacao: number): Promise<string>;
    atualizarEstoque(id: number, quantidade: number): Promise<{
        id: number;
        titulo: string;
        detalhes: string;
        imagem: string;
        estoque: number;
        valorUnitario: import("@prisma/client/runtime/library").Decimal;
        avaliacao: import("@prisma/client/runtime/library").Decimal | null;
        votos: number;
        tipo: import("@prisma/client").$Enums.ProdutoTipo;
        metaId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addAnime(data: any): Promise<any>;
    updateAnime(id: number, updatedData: any): Promise<any>;
    deleteAnime(id: number): Promise<string>;
    ordemAlfabetica(): Promise<any[]>;
}
