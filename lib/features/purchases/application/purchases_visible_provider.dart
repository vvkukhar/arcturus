import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_sort_option.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_ui_controller.dart';

final purchasesVisibleProvider = Provider<List<PurchaseModel>>((ref) {
  final state = ref.watch(purchasesControllerProvider);
  final ui = ref.watch(purchasesUiControllerProvider);

  var items = [...state];

  final query = ui.query.trim().toLowerCase();
  if (query.isNotEmpty) {
    items = items.where((item) {
      return item.source.toLowerCase().contains(query) ||
          item.itemId.toLowerCase().contains(query) ||
          (item.sellerName ?? '').toLowerCase().contains(query) ||
          (item.note ?? '').toLowerCase().contains(query);
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
    items = items.where((item) {
      return item.finalTotal >= filter.minTotal!;
    }).toList();
  }

  if (filter.maxTotal != null) {
    items = items.where((item) {
      return item.finalTotal <= filter.maxTotal!;
    }).toList();
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