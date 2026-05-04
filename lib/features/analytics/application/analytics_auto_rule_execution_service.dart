import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rule_execution_result_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rules_provider.dart';

class AnalyticsAutoRuleExecutionService {
  final Ref ref;

  AnalyticsAutoRuleExecutionService(this.ref);

  Future<AnalyticsAutoRuleExecutionResultModel> run() async {
    final rules = ref.read(analyticsAutoRulesProvider);
    final repo = ref.read(inventoryRepositoryProvider);
    final items = repo.getAllItems();
    final market98 = rules.any((e) => e.id == 'market_98' && e.enabled);
    final oldStockAttention =
        rules.any((e) => e.id == 'old_stock_attention' && e.enabled);
    final profitPriority =
        rules.any((e) => e.id == 'profit_priority' && e.enabled);
    int repriced = 0;
    int oldStock = 0;
    final next = items.map((item) {
      var current = item;
      if (market98 && item.marketAverage != null) {
        current = current.copyWith(
          expectedSalePrice: item.marketAverage! * 0.98,
        );
        repriced++;
      }
      if (oldStockAttention && item.purchaseDate != null) {
        final days = DateTime.now().difference(item.purchaseDate!).inDays;
        if (days >= 60) {
          oldStock++;
        }
      }
      return current;
    }).toList();
    await repo.replaceAll(next);
    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Analytics auto-rules executed',
          subtitle:
              'repriced=$repriced | oldStock=$oldStock | profitPriority=${profitPriority ? 'on' : 'off'}',
        );
    return AnalyticsAutoRuleExecutionResultModel(
      repricedItems: repriced,
      highlightedOldStock: oldStock,
      profitPriorityEnabled: profitPriority,
    );
  }
}

final analyticsAutoRuleExecutionProvider =
    Provider<AnalyticsAutoRuleExecutionService>((ref) {
  return AnalyticsAutoRuleExecutionService(ref);
});