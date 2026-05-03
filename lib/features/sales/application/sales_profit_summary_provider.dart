import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sale_purchase_link_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sales_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sales_profit_summary_model.dart';

final salesProfitSummaryProvider = Provider<SalesProfitSummaryModel>((ref) {
  final sales = ref.watch(salesControllerProvider);
  final purchases = ref.watch(purchasesControllerProvider);
  final links = ref.watch(salePurchaseLinkControllerProvider);

  int matched = 0;
  int totalUnits = 0;
  int matchedUnits = 0;

  double totalNet = 0.0;
  double totalPurchaseCost = 0.0;
  double totalProfit = 0.0;
  double totalRoi = 0.0;

  for (final sale in sales) {
    totalUnits += sale.quantity;
    totalNet += sale.finalNet;

    String? linkedPurchaseId;
    for (final link in links) {
      if (link.saleId == sale.id) {
        linkedPurchaseId = link.purchaseId;
        break;
      }
    }

    final manualMatches = linkedPurchaseId == null
        ? const []
        : purchases.where((purchase) => purchase.id == linkedPurchaseId).toList();

    final itemMatches = purchases.where(
      (purchase) => purchase.itemId == sale.itemId,
    ).toList();

    final purchase = manualMatches.isNotEmpty
        ? manualMatches.first
        : itemMatches.isNotEmpty
            ? itemMatches.first
            : null;

    if (purchase == null) {
      continue;
    }

    matched++;
    matchedUnits += sale.quantity;

    final cost = purchase.unitCost * sale.quantity;
    final profit = sale.finalNet - cost;
    final roi = cost <= 0 ? 0.0 : profit / cost * 100;

    totalPurchaseCost += cost;
    totalProfit += profit;
    totalRoi += roi;
  }

  return SalesProfitSummaryModel(
    totalSales: sales.length,
    matchedSales: matched,
    unmatchedSales: sales.length - matched,
    totalUnits: totalUnits,
    matchedUnits: matchedUnits,
    unmatchedUnits: totalUnits - matchedUnits,
    totalNet: totalNet,
    totalPurchaseCost: totalPurchaseCost,
    totalProfit: totalProfit,
    averageRoiPercent: matched == 0 ? 0.0 : totalRoi / matched,
    averageUnitProfit: matchedUnits <= 0 ? 0.0 : totalProfit / matchedUnits,
  );
});