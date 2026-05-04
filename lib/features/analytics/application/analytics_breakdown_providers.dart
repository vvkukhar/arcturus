import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_breakdown_model.dart';

final analyticsThemeBreakdownProvider = Provider<List<AnalyticsBreakdownEntry>>((ref) {
  final items = ref.watch(inventoryRepositoryProvider).getAllItems();
  final grouped = <String, double>{};

  for (final item in items) {
    final key = (item.theme ?? 'Unknown').trim().isEmpty ? 'Unknown' : item.theme!;
    grouped[key] = (grouped[key] ?? 0) + item.totalCost;
  }

  final entries = grouped.entries
      .map((e) => AnalyticsBreakdownEntry(label: e.key, value: e.value))
      .toList();

  entries.sort((a, b) => b.value.compareTo(a.value));
  return entries;
});

final analyticsPlatformBreakdownProvider = Provider<List<AnalyticsBreakdownEntry>>((ref) {
  final sales = ref.watch(salesRepositoryProvider).getAllSales();
  final grouped = <String, double>{};

  for (final sale in sales) {
    final key = sale.platform;
    grouped[key] = (grouped[key] ?? 0) + sale.finalNet;
  }

  final entries = grouped.entries
      .map((e) => AnalyticsBreakdownEntry(label: e.key, value: e.value))
      .toList();

  entries.sort((a, b) => b.value.compareTo(a.value));
  return entries;
});