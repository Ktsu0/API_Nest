import { PrismaService } from 'src/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
export declare class SeriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private normalize;
    findAll(): Promise<({
        meta: {
            id: number;
            temporada: string;
            tema: string;
        };
    } & {
        id: number;
        titulo: string;
        detalhes: string;
        imagem: string;
        estoque: number;
        valorUnitario: Decimal;
        avaliacao: Decimal | null;
        tipo: import("@prisma/client").$Enums.ProdutoTipo;
        metaId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        meta: {
            id: number;
            temporada: string;
            tema: string;
        };
    } & {
        id: number;
        titulo: string;
        detalhes: string;
        imagem: string;
        estoque: number;
        valorUnitario: Decimal;
        avaliacao: Decimal | null;
        tipo: import("@prisma/client").$Enums.ProdutoTipo;
        metaId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findTema(tema: string): Promise<({
        meta: {
            id: number;
            temporada: string;
            tema: string;
        };
    } & {
        id: number;
        titulo: string;
        detalhes: string;
        imagem: string;
        estoque: number;
        valorUnitario: Decimal;
        avaliacao: Decimal | null;
        tipo: import("@prisma/client").$Enums.ProdutoTipo;
        metaId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findTitulo(searchTerm: string): Promise<({
        meta: {
            id: number;
            temporada: string;
            tema: string;
        };
    } & {
        id: number;
        titulo: string;
        detalhes: string;
        imagem: string;
        estoque: number;
        valorUnitario: Decimal;
        avaliacao: Decimal | null;
        tipo: import("@prisma/client").$Enums.ProdutoTipo;
        metaId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    addSerie(data: {
        titulo: string;
        detalhes: string;
        imagem: string;
        estoque: number;
        valorUnitario: Decimal;
        avaliacao?: Decimal;
        meta: {
            temporada: string;
            tema: string;
        };
    }): Promise<{
        meta: {
            id: number;
            temporada: string;
            tema: string;
        };
    } & {
        id: number;
        titulo: string;
        detalhes: string;
        imagem: string;
        estoque: number;
        valorUnitario: Decimal;
        avaliacao: Decimal | null;
        tipo: import("@prisma/client").$Enums.ProdutoTipo;
        metaId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateImage(id: number, novaImagem: string): Promise<{
        meta: {
            id: number;
            temporada: string;
            tema: string;
        };
    } & {
        id: number;
        titulo: string;
        detalhes: string;
        imagem: string;
        estoque: number;
        valorUnitario: Decimal;
        avaliacao: Decimal | null;
        tipo: import("@prisma/client").$Enums.ProdutoTipo;
        metaId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addAvaliacao(id: number, avaliacao: Decimal): Promise<{
        id: number;
        titulo: string;
        detalhes: string;
        imagem: string;
        estoque: number;
        valorUnitario: Decimal;
        avaliacao: Decimal | null;
        tipo: import("@prisma/client").$Enums.ProdutoTipo;
        metaId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateSerie(id: number, updatedData: {
        titulo?: string;
        detalhes?: string;
        imagem?: string;
        estoque?: number;
        valorUnitario?: Decimal;
        avaliacao?: Decimal;
        meta?: {
            temporada?: string;
            tema?: string;
        };
    }): Promise<{
        meta: {
            id: number;
            temporada: string;
            tema: string;
        };
    } & {
        id: number;
        titulo: string;
        detalhes: string;
        imagem: string;
        estoque: number;
        valorUnitario: Decimal;
        avaliacao: Decimal | null;
        tipo: import("@prisma/client").$Enums.ProdutoTipo;
        metaId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteSerie(id: number): Promise<string>;
    atualizarEstoque(id: number, quantidade: number): Promise<{
        id: number;
        titulo: string;
        detalhes: string;
        imagem: string;
        estoque: number;
        valorUnitario: Decimal;
        avaliacao: Decimal | null;
        tipo: import("@prisma/client").$Enums.ProdutoTipo;
        metaId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    ordemAlfabetica(): Promise<({
        meta: {
            id: number;
            temporada: string;
            tema: string;
        };
    } & {
        id: number;
        titulo: string;
        detalhes: string;
        imagem: string;
        estoque: number;
        valorUnitario: Decimal;
        avaliacao: Decimal | null;
        tipo: import("@prisma/client").$Enums.ProdutoTipo;
        metaId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
