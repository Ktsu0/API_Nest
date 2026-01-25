import { PrismaService } from 'src/prisma.service';
export declare class SeriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private normalize;
    private formatSerie;
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
        tipo: import("@prisma/client").$Enums.ProdutoTipo;
        metaId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addSerie(data: any): Promise<any>;
    updateSerie(id: number, updatedData: any): Promise<any>;
    deleteSerie(id: number): Promise<string>;
    ordemAlfabetica(): Promise<any[]>;
}
