import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';

class PurchasesCurrencyBreakdownModel {
  final String currency;
  final int count;
  final double totalSpend;

  const PurchasesCurrencyBreakdownModel({
    required this.currency,
    required this.count,
    required this.totalSpend,
  });
}

final purchasesCurrencyBreakdownProvider =
    Provider<List<PurchasesCurrencyBreakdownModel>>((ref) {
  final purchases = ref.watch(purchasesControllerProvider).allPurchases;

  final counts = <String, int>{};
  final totals = <String, double>{};

  for (final purchase in purchases) {
    final currency = purchase.currency.trim().toUpperCase();

    counts[currency] = (counts[currency] ?? 0) + 1;
    totals[currency] = (totals[currency] ?? 0) + purchase.finalTotal;
  }

  final result = counts.entries.map((entry) {
    return PurchasesCurrencyBreakdownModel(
      currency: entry.key,
      count: entry.value,
      totalSpend: totals[entry.key] ?? 0,
    );
  }).toList();

  result.sort((a, b) => b.totalSpend.compareTo(a.totalSpend));
  return result;
});