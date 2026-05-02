import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/sales/application/sales_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sales_sort_option.dart';
import 'package:lego_trading_manager/features/sales/application/sales_ui_controller.dart';

final salesVisibleProvider = Provider<List<SaleModel>>((ref) {
  final sales = ref.watch(salesControllerProvider);
  final ui = ref.watch(salesUiControllerProvider);

  var items = [...sales];

  final query = ui.query.trim().toLowerCase();
  if (query.isNotEmpty) {
    items = items.where((item) {
      return item.itemId.toLowerCase().contains(query) ||
          item.platform.toLowerCase().contains(query) ||
          (item.buyerName ?? '').toLowerCase().contains(query);
    }).toList();
  }

  final filter = ui.filter;

  if ((filter.platformContains ?? '').trim().isNotEmpty) {
    final platform = filter.platformContains!.trim().toLowerCase();
    items = items.where((item) {
      return item.platform.toLowerCase().contains(platform);
    }).toList();
  }

  if ((filter.buyerContains ?? '').trim().isNotEmpty) {
    final buyer = filter.buyerContains!.trim().toLowerCase();
    items = items.where((item) {
      return (item.buyerName ?? '').toLowerCase().contains(buyer);
    }).toList();
  }

  if (filter.minNet != null) {
    items = items.where((item) => item.finalNet >= filter.minNet!).toList();
  }

  if (filter.maxNet != null) {
    items = items.where((item) => item.finalNet <= filter.maxNet!).toList();
  }

  switch (ui.sort) {
    case SalesSortOption.newest:
      items.sort((a, b) => b.saleDate.compareTo(a.saleDate));
      break;
    case SalesSortOption.oldest:
      items.sort((a, b) => a.saleDate.compareTo(b.saleDate));
      break;
    case SalesSortOption.finalNetHighToLow:
      items.sort((a, b) => b.finalNet.compareTo(a.finalNet));
      break;
    case SalesSortOption.finalNetLowToHigh:
      items.sort((a, b) => a.finalNet.compareTo(b.finalNet));
      break;
    case SalesSortOption.platformAsc:
      items.sort(
        (a, b) => a.platform.toLowerCase().compareTo(b.platform.toLowerCase()),
      );
      break;
  }

  return items;
});