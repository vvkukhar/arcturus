import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';

class PurchasesSourceBreakdownModel {
  final String source;
  final int count;
  final double totalSpend;

  const PurchasesSourceBreakdownModel({
    required this.source,
    required this.count,
    required this.totalSpend,
  });
}

final purchasesSourceBreakdownProvider =
    Provider<List<PurchasesSourceBreakdownModel>>((ref) {
  final purchases = ref.watch(purchasesControllerProvider).allPurchases;

  final counts = <String, int>{};
  final totals = <String, double>{};

  for (final purchase in purchases) {
    final source = purchase.source.trim().isEmpty ? 'unknown' : purchase.source;

    counts[source] = (counts[source] ?? 0) + 1;
    totals[source] = (totals[source] ?? 0) + purchase.finalTotal;
  }

  final result = counts.entries.map((entry) {
    return PurchasesSourceBreakdownModel(
      source: entry.key,
      count: entry.value,
      totalSpend: totals[entry.key] ?? 0,
    );
  }).toList();

  result.sort((a, b) => b.totalSpend.compareTo(a.totalSpend));
  return result;
});