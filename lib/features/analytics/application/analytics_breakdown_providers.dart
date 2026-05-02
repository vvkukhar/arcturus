// lib/features/analytics/application/analytics_breakdown_providers.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/sales_repository.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_breakdown_model.dart';

final analyticsThemeBreakdownProvider =
    Provider<List<AnalyticsBreakdownEntry>>((ref) {
  final items = InventoryRepository().getAllItems();
  final grouped = <String, double>{};

  for (final item in items) {
    final key =
        (item.theme ?? 'Unknown').trim().isEmpty ? 'Unknown' : item.theme!;
    grouped[key] = (grouped[key] ?? 0) + item.totalCost;
  }

  final entries = grouped.entries
      .map((e) => AnalyticsBreakdownEntry(label: e.key, value: e.value))
      .toList();

  entries.sort((a, b) => b.value.compareTo(a.value));
  return entries;
});

final analyticsPlatformBreakdownProvider =
    Provider<List<AnalyticsBreakdownEntry>>((ref) {
  final sales = SalesRepository().getAllSales();
  final grouped = <String, double>{};

  for (final sale in sales) {
    final key = sale.platform.name;
    grouped[key] = (grouped[key] ?? 0) + sale.finalNet;
  }

  final entries = grouped.entries
      .map((e) => AnalyticsBreakdownEntry(label: e.key, value: e.value))
      .toList();

  entries.sort((a, b) => b.value.compareTo(a.value));
  return entries;
});
