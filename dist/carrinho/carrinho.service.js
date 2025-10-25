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
let CarrinhoService = class CarrinhoService {
    seriesService;
    animesService;
    constructor(seriesService, animesService) {
        this.seriesService = seriesService;
        this.animesService = animesService;
    }
    validarCarrinho(itensCarrinho) {
        const validacao = {
            items: [],
            validacao: {
                totalItens: 0,
                valorTotal: 0,
                erros: [],
            },
        };
        let totalItens = 0;
        let valorTotal = 0;
        for (const item of itensCarrinho) {
            let produto;
            if (item.tipo === 'serie')
                produto = this.seriesService.findOne(item.id);
            else if (item.tipo === 'anime')
                produto = this.animesService.findOne(item.id);
            if (!produto) {
                validacao.validacao.erros.push(`${item.tipo === 'serie' ? 'Série' : 'Anime'} com ID ${item.id} não encontrada.`);
                continue;
            }
            const { id, titulo, estoque, valorUnitario } = produto;
            const quantidade = item.quantidade;
            if (quantidade <= 0) {
                validacao.validacao.erros.push(`Quantidade inválida para ${titulo}.`);
                continue;
            }
            if (quantidade > estoque) {
                validacao.validacao.erros.push(`Estoque insuficiente para ${titulo}. Pedido: ${quantidade}, Disponível: ${estoque}.`);
            }
            const valorItem = valorUnitario * quantidade;
            totalItens += quantidade;
            valorTotal += valorItem;
            validacao.items.push({
                tipo: item.tipo,
                produtoId: id,
                titulo,
                valorUnitario,
                quantidadeDesejada: quantidade,
                estoqueDisponivel: estoque,
            });
        }
        validacao.validacao.totalItens = totalItens;
        validacao.validacao.valorTotal = parseFloat(valorTotal.toFixed(2));
        return validacao;
    }
    finalizarCompra(itensCarrinho) {
        const validacao = this.validarCarrinho(itensCarrinho);
        if (validacao.validacao.erros.length > 0) {
            return validacao.validacao.erros;
        }
        for (const item of itensCarrinho) {
            if (item.tipo === 'serie')
                this.seriesService.atualizarEstoque(item.id, item.quantidade);
            else if (item.tipo === 'anime')
                this.animesService.atualizarEstoque(item.id, item.quantidade);
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