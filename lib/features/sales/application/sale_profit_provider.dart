import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_summary_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sale_linked_purchase_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sale_profit_model.dart';
import 'package:lego_trading_manager/features/sales/application/sale_profit_service.dart';

final saleProfitServiceProvider = Provider<SaleProfitService>((ref) {
  return const SaleProfitService();
});

final saleProfitProvider = Provider.family<SaleProfitModel, SaleModel>((ref, sale) {
  final allocation = ref.watch(saleAllocationSummaryProvider(sale));
  final linkedPurchase = ref.watch(saleLinkedPurchaseProvider(sale));
  final service = ref.watch(saleProfitServiceProvider);

  final hasAllocatedCost = allocation.hasAllocation;

  final purchaseCost = hasAllocatedCost
      ? allocation.allocatedCost
      : linkedPurchase == null
          ? 0
          : linkedPurchase.unitCost * sale.quantity;

  final hasPurchaseCost = hasAllocatedCost || linkedPurchase != null;

  final profit = service.profit(
    saleNet: sale.finalNet,
    purchaseCost: purchaseCost,
  );

  final unitCost = sale.quantity <= 0 ? purchaseCost : purchaseCost / sale.quantity;
  final unitProfit = sale.quantity <= 0 ? profit : profit / sale.quantity;

  return SaleProfitModel(
    saleId: sale.id,
    itemId: sale.itemId,
    quantity: sale.quantity,
    saleNet: sale.finalNet,
    unitNet: sale.unitNet,
    purchaseCost: purchaseCost,
    unitCost: unitCost,
    profit: hasPurchaseCost ? profit : 0,
    unitProfit: hasPurchaseCost ? unitProfit : 0,
    roiPercent: hasPurchaseCost
        ? service.roiPercent(
            profit: profit,
            purchaseCost: purchaseCost,
          )
        : 0,
    hasPurchaseCost: hasPurchaseCost,
  );
});