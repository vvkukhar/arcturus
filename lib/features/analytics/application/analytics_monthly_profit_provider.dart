import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_monthly_profit_model.dart';

final analyticsMonthlyProfitProvider =
    Provider<List<AnalyticsMonthlyProfitModel>>((ref) {
  final sales = ref.watch(salesRepositoryProvider).getAllSales();
  final grouped = <String, List<SaleModel>>{};

  for (final sale in sales) {
    final date = sale.saleDate;
    final key = '${date.year}-${date.month.toString().padLeft(2, '0')}';
    grouped.putIfAbsent(key, () => <SaleModel>[]).add(sale);
  }

  final result = grouped.entries.map((entry) {
    final monthSales = entry.value;

    final revenue = monthSales.fold<double>(
      0,
      (sum, sale) => sum + sale.salePrice,
    );

    final netProfit = monthSales.fold<double>(
      0,
      (sum, sale) => sum + sale.finalNet,
    );

    return AnalyticsMonthlyProfitModel(
      label: entry.key,
      revenue: revenue,
      netProfit: netProfit,
      salesCount: monthSales.length,
    );
  }).toList();

  result.sort((a, b) => a.label.compareTo(b.label));
  return result;
});