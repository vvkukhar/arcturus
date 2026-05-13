"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCents = toCents;
exports.fromCents = fromCents;
exports.toMoney = toMoney;
exports.addMoney = addMoney;
exports.calculateProfit = calculateProfit;
exports.calculateRoiPercent = calculateRoiPercent;
exports.calculateMarginPercent = calculateMarginPercent;
function toCents(value) {
    if (!Number.isFinite(value))
        return 0;
    return Math.round(value * 100);
}
function fromCents(cents) {
    if (!Number.isFinite(cents))
        return 0;
    return Math.round(cents) / 100;
}
function toMoney(value) {
    if (!Number.isFinite(value))
        return 0;
    return fromCents(toCents(value));
}
function addMoney(...values) {
    const totalCents = values.reduce((sum, val) => sum + toCents(val), 0);
    return fromCents(totalCents);
}
function calculateProfit(params) {
    const revCents = toCents(params.revenue);
    const costCents = toCents(params.cost);
    return fromCents(revCents - costCents);
}
function calculateRoiPercent(params) {
    const costCents = toCents(params.cost);
    if (costCents <= 0)
        return 0;
    const profitCents = toCents(params.profit);
    return Math.round((profitCents / costCents) * 10000) / 100;
}
function calculateMarginPercent(params) {
    const revenueCents = toCents(params.revenue);
    if (revenueCents <= 0)
        return 0;
    const profitCents = toCents(params.profit);
    return Math.round((profitCents / revenueCents) * 10000) / 100;
}
