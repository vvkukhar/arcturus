"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSourceError = logSourceError;
const prisma_1 = require("../prisma");
async function logSourceError(params) {
    await prisma_1.prisma.syncErrorLog.create({
        data: {
            scope: params.scope,
            sourceCode: params.sourceCode,
            referenceId: params.referenceId,
            message: params.message,
            detailsJson: params.detailsJson ?? {},
        },
    });
}
