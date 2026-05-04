import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';

class AnalyticsThemeProfitEntry {
  final String theme;
  final double expectedProfit;
  final int count;

  const AnalyticsThemeProfitEntry({
    required this.theme,
    required this.expectedProfit,
    required this.count,
  });
}

final analyticsThemeProfitProvider =
    Provider<List<AnalyticsThemeProfitEntry>>((ref) {
  final items = ref.watch(inventoryRepositoryProvider).getAllItems();
  final grouped = <String, List<dynamic>>{};

  for (final item in items) {
    final key =
        (item.theme ?? 'Unknown').trim().isEmpty ? 'Unknown' : item.theme!;
    grouped.putIfAbsent(key, () => []).add(item);
  }

  final result = grouped.entries.map((entry) {
    final items = entry.value;
    final expectedProfit = items.fold<double>(
      0,
      (sum, item) => sum + ((item.expectedSalePrice ?? 0) - item.totalCost),
    );

    return AnalyticsThemeProfitEntry(
      theme: entry.key,
      expectedProfit: expectedProfit,
      count: items.length,
    );
  }).toList();

  result.sort((a, b) => b.expectedProfit.compareTo(a.expectedProfit));
  return result;
});