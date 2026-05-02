import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_diff_totals_model.dart';
import 'package:lego_trading_manager/features/analytics/application/market_inventory_reprice_suggestion_provider.dart';

final analyticsRepriceDiffTotalsProvider =
    Provider<AnalyticsRepriceDiffTotalsModel>((ref) {
  final items = ref.watch(marketInventoryRepriceSuggestionProvider);
  double positive = 0;
  double negative = 0;
  int raised = 0;
  int lowered = 0;
  for (final item in items) {
    final diff = item.suggestedPrice - item.currentExpected;
    if (diff >= 0) {
      positive += diff;
      raised++;
    } else {
      negative += diff.abs();
      lowered++;
    }
  }
  return AnalyticsRepriceDiffTotalsModel(
    positiveDelta: positive,
    negativeDelta: negative,
    raisedCount: raised,
    loweredCount: lowered,
  );
});
