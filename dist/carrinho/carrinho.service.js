"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarrinhoService = void 0;
const common_1 = require("@nestjs/common");
const series_service_1 = require("./../cardsSerie/series.service");
const anime_service_1 = require("./../cardsAnime/anime.service");
const client_1 = require("@prisma/client");
let CarrinhoService = class CarrinhoService {
    seriesService;
    animesService;
    constructor(seriesService, animesService) {
        this.seriesService = seriesService;
        this.animesService = animesService;
    }
    async validarCarrinho(itensCarrinho) {
        const validacao = {
            items: [],
            validacao: {
                totalItens: 0,
                valorTotal: 0,
                erros: [],
            },
        };
        let totalItens = 0;
        let valorTotal = new client_1.Prisma.Decimal(0);
        for (const item of itensCarrinho) {
            let produto = null;
            try {
                if (item.tipo === 'serie') {
                    produto = await this.seriesService.findOne(item.id);
                }
                else if (item.tipo === 'anime') {
                    produto = await this.animesService.findOne(item.id);
                }
            }
            catch {
                produto = null;
            }
            if (!produto) {
                validacao.validacao.erros.push(`Produto com ID ${item.id} não encontrado em nenhum catálogo.`);
                continue;
            }
            const { id, titulo, estoque, valorUnitario, tipo } = produto;
            const quantidade = item.quantidade;
            if (quantidade <= 0) {
                validacao.validacao.erros.push(`Quantidade inválida para "${titulo}".`);
                continue;
            }
            if (quantidade > estoque) {
                validacao.validacao.erros.push(`Estoque insuficiente para "${titulo}". Pedido: ${quantidade}, Disponível: ${estoque}.`);
            }
            const valorItem = valorUnitario.mul(quantidade);
            totalItens += quantidade;
            valorTotal = valorTotal.add(valorItem);
            validacao.items.push({
                tipo: tipo === client_1.ProdutoTipo.SERIE ? 'serie' : 'anime',
                produtoId: id,
                titulo,
                valorUnitario: valorUnitario.toNumber(),
                quantidadeDesejada: quantidade,
                estoqueDisponivel: estoque,
            });
        }
        validacao.validacao.totalItens = totalItens;
        validacao.validacao.valorTotal = Number(valorTotal.toFixed(2));
        return validacao;
    }
    async finalizarCompra(itensCarrinho) {
        const validacao = await this.validarCarrinho(itensCarrinho);
        if (validacao.validacao.erros.length > 0) {
            return validacao.validacao.erros;
        }
        for (const item of itensCarrinho) {
            if (item.tipo === 'serie') {
                await this.seriesService.atualizarEstoque(item.id, item.quantidade);
            }
            else if (item.tipo === 'anime') {
                await this.animesService.atualizarEstoque(item.id, item.quantidade);
            }
        }
        return [
            `Compra de ${validacao.validacao.totalItens} itens no total de R$ ${validacao.validacao.valorTotal.toFixed(2)} finalizada com sucesso.`,
        ];
    }
};
exports.CarrinhoService = CarrinhoService;
exports.CarrinhoService = CarrinhoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [series_service_1.SeriesService,
        anime_service_1.AnimeService])
], CarrinhoService);
//# sourceMappingURL=carrinho.service.js.map