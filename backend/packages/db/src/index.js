"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrismaClient = void 0;
const client_1 = require("@prisma/client");
__exportStar(require("@prisma/client"), exports);
const softDeleteModels = ['Sale', 'Order', 'ReturnRequest', 'Expense'];
const createPrismaClient = () => {
    const prisma = new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
    return prisma.$extends({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    if (softDeleteModels.includes(model)) {
                        if (['findFirst', 'findFirstOrThrow', 'findMany', 'count', 'aggregate', 'groupBy'].includes(operation)) {
                            args.where = { ...args.where, deletedAt: null };
                        }
                        else if (operation === 'findUnique' || operation === 'findUniqueOrThrow') {
                            const result = await query(args);
                            if (result && result.deletedAt !== null) {
                                if (operation === 'findUniqueOrThrow')
                                    throw new Error(`${model} not found`);
                                return null;
                            }
                            return result;
                        }
                    }
                    return query(args);
                },
            },
        },
    });
};
exports.createPrismaClient = createPrismaClient;
