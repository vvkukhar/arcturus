"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueueUnresolvedMatch = enqueueUnresolvedMatch;
const prisma_1 = require("../prisma");
async function enqueueUnresolvedMatch(payload) {
    const existing = await prisma_1.prisma.unresolvedMatchQueue.findFirst({
        where: { listingId: payload.listingId }
    });
    if (existing) {
        await prisma_1.prisma.unresolvedMatchQueue.update({
            where: { id: existing.id },
            data: {
                titleRaw: payload.titleRaw,
                updatedAt: new Date(),
            },
        });
    }
    else {
        await prisma_1.prisma.unresolvedMatchQueue.create({
            data: {
                listingId: payload.listingId,
                sourceCode: payload.sourceCode,
                titleRaw: payload.titleRaw,
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 'pending'
            }
        });
    }
}
