"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSourceRun = startSourceRun;
exports.finishSourceRun = finishSourceRun;
const prisma_1 = require("../prisma");
async function startSourceRun(sourceCode) {
    const source = await prisma_1.prisma.marketSource.findUnique({
        where: {
            code: sourceCode,
        },
    });
    if (!source) {
        throw new Error(`Source not found: ${sourceCode}`);
    }
    const run = await prisma_1.prisma.sourceRunLog.create({
        data: {
            sourceId: source.id,
            startedAt: new Date(),
            status: 'running',
            itemsSeen: 0,
            itemsMatched: 0,
            itemsInserted: 0,
            itemsUpdated: 0,
        },
    });
    return run.id;
}
async function finishSourceRun(params) {
    await prisma_1.prisma.sourceRunLog.update({
        where: {
            id: params.runId,
        },
        data: {
            finishedAt: new Date(),
            status: params.status,
            itemsSeen: params.itemsSeen,
            itemsMatched: params.itemsMatched,
            itemsInserted: params.itemsInserted,
            itemsUpdated: params.itemsUpdated,
            errorMessage: params.errorMessage,
        },
    });
}
