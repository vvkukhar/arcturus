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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveItemIdFromTitle = resolveItemIdFromTitle;
const prisma_1 = require("../prisma");
const stringSimilarity = __importStar(require("string-similarity"));
async function resolveItemIdFromTitle(titleRaw) {
    const normalizedTitle = titleRaw.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    const setNumberMatch = normalizedTitle.match(/\b\d{4,5}\b/);
    if (setNumberMatch) {
        const setNumber = setNumberMatch[0];
        const exactMatch = await prisma_1.prisma.item.findFirst({
            where: { setNumber: setNumber },
            select: { id: true }
        });
        if (exactMatch)
            return exactMatch.id;
    }
    const activeWatchlist = await prisma_1.prisma.watchlistItem.findMany({
        where: { active: true },
        select: { itemId: true, item: { select: { title: true, setNumber: true } } }
    });
    let bestMatchId = null;
    let highestRating = 0.55;
    for (const target of activeWatchlist) {
        if (!target.item)
            continue;
        const targetName = target.item.title.toLowerCase();
        const rating = stringSimilarity.compareTwoStrings(normalizedTitle, targetName);
        if (rating > highestRating) {
            highestRating = rating;
            bestMatchId = target.itemId;
        }
    }
    return bestMatchId;
}
