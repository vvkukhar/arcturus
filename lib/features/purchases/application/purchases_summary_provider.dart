import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';

class PurchasesSummaryModel {
  final int total;
  final double totalSpend;
  final double averageSpend;
  final String topCurrency;

  const PurchasesSummaryModel({
    required this.total,
    required this.totalSpend,
    required this.averageSpend,
    required this.topCurrency,
  });
}

final purchasesSummaryProvider = Provider<PurchasesSummaryModel>((ref) {
  final purchases = ref.watch(purchasesControllerProvider).allPurchases;

  if (purchases.isEmpty) {
    return const PurchasesSummaryModel(
      total: 0,
      totalSpend: 0,
      averageSpend: 0,
      topCurrency: '-',
    );
  }

  double totalSpend = 0;
  final currencyCounts = <String, int>{};

  for (final purchase in purchases) {
    totalSpend += purchase.finalTotal;

    final currency = purchase.currency.trim().toUpperCase();
    currencyCounts[currency] = (currencyCounts[currency] ?? 0) + 1;
  }

  final sortedCurrencies = currencyCounts.entries.toList()
    ..sort((a, b) => b.value.compareTo(a.value));

  return PurchasesSummaryModel(
    total: purchases.length,
    totalSpend: totalSpend,
    averageSpend: totalSpend / purchases.length,
    topCurrency:
        sortedCurrencies.isEmpty ? '-' : sortedCurrencies.first.key,
  );
});