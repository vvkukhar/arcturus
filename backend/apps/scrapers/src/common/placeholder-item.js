"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreatePlaceholderItemId = getOrCreatePlaceholderItemId;
const prisma_1 = require("../prisma");
async function getOrCreatePlaceholderItemId() {
    const placeholder = await prisma_1.prisma.item.upsert({
        where: {
            id: 'item_unresolved_placeholder',
        },
        update: {},
        create: {
            id: 'item_unresolved_placeholder',
            kind: 'unknown',
            title: 'UNRESOLVED_PLACEHOLDER',
            conditionDefault: 'unknown',
        },
        select: {
            id: true,
        },
    });
    return placeholder.id;
}
