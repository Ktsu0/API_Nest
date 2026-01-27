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
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let CarrinhoService = class CarrinhoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validarCarrinho(itensCarrinho) {
        console.log('[CarrinhoService] Validando itens:', JSON.stringify(itensCarrinho));
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
            const itemId = Number(item.id);
            const itemTipo = String(item.tipo).toLowerCase();
            const produto = await this.prisma.serie.findUnique({
                where: { id: itemId },
                select: {
                    id: true,
                    titulo: true,
                    estoque: true,
                    valorUnitario: true,
                    tipo: true,
                },
            });
            if (!produto) {
                validacao.validacao.erros.push(`Produto com ID ${item.id} não encontrado.`);
                continue;
            }
            const produtoTipoStr = String(produto.tipo).toLowerCase();
            if (itemTipo !== produtoTipoStr) {
                console.warn(`Divergência de tipo para ID ${produto.id}: Frontend=${itemTipo}, DB=${produtoTipoStr}`);
            }
            if (item.quantidade <= 0) {
                validacao.validacao.erros.push(`Quantidade inválida para "${produto.titulo}".`);
                continue;
            }
            if (produto.estoque < item.quantidade) {
                validacao.validacao.erros.push(`Estoque insuficiente para "${produto.titulo}". Pedido: ${item.quantidade}, Disponível: ${produto.estoque}.`);
            }
            const valorItem = Number(produto.valorUnitario) * item.quantidade;
            totalItens += item.quantidade;
            valorTotal = valorTotal.add(new client_1.Prisma.Decimal(valorItem));
            validacao.items.push({
                tipo: produtoTipoStr,
                produtoId: produto.id,
                titulo: produto.titulo,
                valorUnitario: Number(produto.valorUnitario),
                quantidadeDesejada: item.quantidade,
                estoqueDisponivel: produto.estoque,
            });
        }
        validacao.validacao.totalItens = totalItens;
        validacao.validacao.valorTotal = Number(valorTotal.toFixed(2));
        console.log('[CarrinhoService] Resultado da validação:', JSON.stringify(validacao));
        return validacao;
    }
    async finalizarCompra(itensCarrinho) {
        return this.prisma.$transaction(async (tx) => {
            let totalItens = 0;
            let valorTotal = new client_1.Prisma.Decimal(0);
            const erros = [];
            for (const item of itensCarrinho) {
                const produto = await tx.serie.findUnique({
                    where: { id: item.id },
                    select: {
                        id: true,
                        titulo: true,
                        estoque: true,
                        valorUnitario: true,
                        tipo: true,
                    },
                });
                if (!produto) {
                    erros.push(`Produto com ID ${item.id} não encontrado.`);
                    continue;
                }
                const itemTipo = String(item.tipo).toLowerCase();
                const produtoTipoStr = String(produto.tipo).toLowerCase();
                if (itemTipo !== produtoTipoStr) {
                    console.warn(`Divergência de tipo na compra para ID ${produto.id}: Frontend=${itemTipo}, DB=${produtoTipoStr}`);
                }
                if (item.quantidade <= 0) {
                    erros.push(`Quantidade inválida para "${produto.titulo}".`);
                    continue;
                }
                if (produto.estoque < item.quantidade) {
                    erros.push(`Estoque insuficiente para "${produto.titulo}". Pedido: ${item.quantidade}, Disponível: ${produto.estoque}.`);
                    continue;
                }
                await tx.serie.update({
                    where: { id: produto.id },
                    data: {
                        estoque: {
                            decrement: Number(item.quantidade),
                        },
                    },
                });
                const valorItem = Number(produto.valorUnitario) * item.quantidade;
                totalItens += item.quantidade;
                valorTotal = valorTotal.add(new client_1.Prisma.Decimal(valorItem));
            }
            if (erros.length > 0) {
                throw new common_1.BadRequestException(erros);
            }
            return [
                `Compra de ${totalItens} itens no total de R$ ${Number(valorTotal.toFixed(2))} finalizada com sucesso.`,
            ];
        });
    }
};
exports.CarrinhoService = CarrinhoService;
exports.CarrinhoService = CarrinhoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CarrinhoService);
//# sourceMappingURL=carrinho.service.js.map