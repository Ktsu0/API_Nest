import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../fireBase/firebase.service';
import * as levenshtein from 'fast-levenshtein';
import { Serie } from '../model/series.model';

@Injectable()
export class SerieFirebaseService {
  constructor(private readonly firebase: FirebaseService) {}

  private get collection() {
    return this.firebase.db.collection('series');
  }

  // -------------------------------
  // Utils
  // -------------------------------

  private normalize(texto: string): string {
    return (texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  private formatSerie(serie: Serie): Serie {
    return {
      ...serie,
      valorUnitario: Number(serie.valorUnitario || 0),
      avaliacao:
        serie.avaliacao !== undefined ? Number(serie.avaliacao) : undefined,
    };
  }

  // Mapper Firestore → Model
  private mapFirestoreSerie(
    id: string,
    data: FirebaseFirestore.DocumentData,
  ): Serie {
    return {
      id,
      titulo: String(data.titulo || ''),
      meta: {
        temporada: String(data.meta?.temporada || ''),
        tema: String(data.meta?.tema || ''),
      },
      detalhes: String(data.detalhes || ''),
      imagem: String(data.imagem || ''),
      estoque: Number(data.estoque || 0),
      valorUnitario: Number(data.valorUnitario || 0),
      votos: Number(data.votos || 0),
      avaliacao:
        data.avaliacao !== undefined ? Number(data.avaliacao) : undefined,
      tipo: data.tipo ? String(data.tipo) : undefined,
    };
  }

  // -------------------------------
  // Queries
  // -------------------------------

  async findAll(): Promise<Serie[]> {
    const snapshot = await this.collection.orderBy('titulo').get();

    return snapshot.docs.map((doc) =>
      this.formatSerie(this.mapFirestoreSerie(doc.id, doc.data())),
    );
  }

  async findOne(id: string): Promise<Serie> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
    }

    return this.formatSerie(this.mapFirestoreSerie(doc.id, doc.data()!));
  }

  async findTema(tema: string): Promise<Serie[]> {
    const temaBusca = this.normalize(tema);

    const snapshot = await this.collection
      .where('meta.tema_normalized', '>=', temaBusca)
      .where('meta.tema_normalized', '<=', temaBusca + '\uf8ff')
      .get();

    return snapshot.docs.map((doc) =>
      this.formatSerie(this.mapFirestoreSerie(doc.id, doc.data())),
    );
  }

  async findTitulo(searchTerm: string): Promise<Serie[]> {
    const termBusca = this.normalize(searchTerm);

    const snapshot = await this.collection.get();
    const series = snapshot.docs.map((doc) =>
      this.mapFirestoreSerie(doc.id, doc.data()),
    );

    let filtered = series.filter((serie) =>
      this.normalize(serie.titulo).includes(termBusca),
    );

    if (!filtered.length && termBusca.length >= 3) {
      const MAX_DISTANCE =
        termBusca.length > 8 ? 2 : termBusca.length > 5 ? 1 : 0;

      filtered = series.filter((serie) => {
        const distance = levenshtein.get(
          termBusca,
          this.normalize(serie.titulo),
        );
        return distance <= MAX_DISTANCE;
      });
    }

    return filtered.map((s) => this.formatSerie(s));
  }

  // -------------------------------
  // Commands
  // -------------------------------

  async addSerie(data: any): Promise<Serie> {
    try {
      const ref = this.collection.doc();

      const payload = {
        titulo: data.titulo,
        titulo_normalized: this.normalize(data.titulo),
        detalhes: data.detalhes,
        imagem: data.imagem,
        estoque: Number(data.estoque),
        valorUnitario: Number(data.valorUnitario),
        avaliacao: data.avaliacao ? Number(data.avaliacao) : undefined,
        votos: 0,
        tipo: 'SERIE',
        meta: {
          temporada: String(data.meta?.temporada || ''),
          tema: String(data.meta?.tema || ''),
          tema_normalized: this.normalize(data.meta?.tema || ''),
        },
        createdAt: new Date(),
      };

      await ref.set(payload);

      return this.formatSerie(this.mapFirestoreSerie(ref.id, payload));
    } catch (error) {
      console.error('Erro ao adicionar série no Firebase:', error);
      throw error;
    }
  }

  async updateSerie(id: string, updatedData: any): Promise<Serie> {
    const ref = this.collection.doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
    }

    const patch: any = {
      ...(updatedData.titulo && {
        titulo: updatedData.titulo,
        titulo_normalized: this.normalize(updatedData.titulo),
      }),
      ...(updatedData.detalhes && { detalhes: updatedData.detalhes }),
      ...(updatedData.imagem && { imagem: updatedData.imagem }),
      ...(updatedData.estoque !== undefined && {
        estoque: Number(updatedData.estoque),
      }),
      ...(updatedData.valorUnitario !== undefined && {
        valorUnitario: Number(updatedData.valorUnitario),
      }),
      ...(updatedData.avaliacao !== undefined && {
        avaliacao: Number(updatedData.avaliacao),
      }),
      ...(updatedData.meta && {
        meta: {
          ...snap.data()?.meta,
          ...(updatedData.meta.temporada && {
            temporada: updatedData.meta.temporada,
          }),
          ...(updatedData.meta.tema && {
            tema: updatedData.meta.tema,
            tema_normalized: this.normalize(updatedData.meta.tema),
          }),
        },
      }),
      updatedAt: new Date(),
    };

    await ref.update(patch);

    return this.findOne(id);
  }

  async deleteSerie(id: string): Promise<string> {
    const ref = this.collection.doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      throw new NotFoundException(
        `Série com ID "${id}" não encontrada ou erro ao deletar.`,
      );
    }

    await ref.delete();
    return `Série removida com sucesso.`;
  }

  // -------------------------------
  // Transactions
  // -------------------------------

  async addAvaliacao(id: string, avaliacao: number): Promise<string> {
    const ref = this.collection.doc(id);

    return this.firebase.db.runTransaction(
      async (tx: FirebaseFirestore.Transaction) => {
        const snap = (await tx.get(ref)) as FirebaseFirestore.DocumentSnapshot;

        if (!snap.exists) {
          throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
        }

        const data = snap.data() as any;

        const votos = Number(data.votos || 0);
        const somaAtual = Number(data.avaliacao || 0) * votos;

        const totalVotos = votos + 1;
        const novaMedia = (somaAtual + Number(avaliacao)) / totalVotos;

        tx.update(ref, {
          avaliacao: Number(novaMedia.toFixed(2)),
          votos: totalVotos,
          updatedAt: new Date(),
        });

        return `Avaliação de ${avaliacao} processada. Nova média: ${novaMedia.toFixed(2)}`;
      },
    );
  }

  async atualizarEstoque(id: string, quantidade: number): Promise<Serie> {
    const ref = this.collection.doc(id);

    return this.firebase.db.runTransaction(
      async (tx: FirebaseFirestore.Transaction) => {
        const snap = (await tx.get(ref)) as FirebaseFirestore.DocumentSnapshot;

        if (!snap.exists) {
          throw new NotFoundException(`Série com ID "${id}" não encontrada.`);
        }

        const data = snap.data() as any;

        const estoqueAtual = Number(data.estoque || 0);
        const novoEstoque = estoqueAtual - Number(quantidade);

        tx.update(ref, {
          estoque: novoEstoque,
          updatedAt: new Date(),
        });

        return this.findOne(id);
      },
    );
  }

  async ordemAlfabetica(): Promise<Serie[]> {
    return this.findAll();
  }
}
