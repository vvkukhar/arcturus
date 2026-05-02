import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchases_with_stock_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_sort_option.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_ui_controller.dart';

final purchasesVisibleWithStockProvider = Provider<List<PurchaseModel>>((ref) {
  final purchases = ref.watch(purchasesWithStockProvider);
  final ui = ref.watch(purchasesUiControllerProvider);

  var items = [...purchases];

  final query = ui.query.trim().toLowerCase();
  if (query.isNotEmpty) {
    items = items.where((item) {
      return item.itemId.toLowerCase().contains(query) ||
          item.source.toLowerCase().contains(query) ||
          (item.sellerName ?? '').toLowerCase().contains(query);
    }).toList();
  }

  final filter = ui.filter;

  if ((filter.sourceContains ?? '').trim().isNotEmpty) {
    final source = filter.sourceContains!.trim().toLowerCase();
    items = items.where((item) {
      return item.source.toLowerCase().contains(source);
    }).toList();
  }

  if ((filter.currency ?? '').trim().isNotEmpty) {
    final currency = filter.currency!.trim().toUpperCase();
    items = items.where((item) {
      return item.currency.toUpperCase() == currency;
    }).toList();
  }

  if (filter.minTotal != null) {
    items = items.where((item) => item.finalTotal >= filter.minTotal!).toList();
  }

  if (filter.maxTotal != null) {
    items = items.where((item) => item.finalTotal <= filter.maxTotal!).toList();
  }

  switch (ui.sort) {
    case PurchasesSortOption.newest:
      items.sort((a, b) => b.purchaseDate.compareTo(a.purchaseDate));
      break;
    case PurchasesSortOption.oldest:
      items.sort((a, b) => a.purchaseDate.compareTo(b.purchaseDate));
      break;
    case PurchasesSortOption.totalHighToLow:
      items.sort((a, b) => b.finalTotal.compareTo(a.finalTotal));
      break;
    case PurchasesSortOption.totalLowToHigh:
      items.sort((a, b) => a.finalTotal.compareTo(b.finalTotal));
      break;
    case PurchasesSortOption.sourceAsc:
      items.sort(
        (a, b) => a.source.toLowerCase().compareTo(b.source.toLowerCase()),
      );
      break;
  }

  return items;
});