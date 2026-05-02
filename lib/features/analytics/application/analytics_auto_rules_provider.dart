import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rule_model.dart';

class AnalyticsAutoRulesController
    extends StateNotifier<List<AnalyticsAutoRuleModel>> {
  AnalyticsAutoRulesController()
      : super(const [
          AnalyticsAutoRuleModel(
            id: 'market_98',
            title: 'Market 98% repricing',
            description: 'When applied manually, use 98% of market average.',
            enabled: true,
          ),
          AnalyticsAutoRuleModel(
            id: 'old_stock_attention',
            title: 'Old stock attention',
            description: 'Highlight older held stock for review.',
            enabled: true,
          ),
          AnalyticsAutoRuleModel(
            id: 'profit_priority',
            title: 'Profit priority sorting',
            description: 'Prefer higher expected profit candidates.',
            enabled: false,
          ),
        ]);

  void toggle(String id) {
    state = [
      for (final item in state)
        if (item.id == id) item.copyWith(enabled: !item.enabled) else item,
    ];
  }

  void replaceAll(List<AnalyticsAutoRuleModel> items) {
    state = items;
  }
}

final analyticsAutoRulesProvider = StateNotifierProvider<
    AnalyticsAutoRulesController, List<AnalyticsAutoRuleModel>>(
  (ref) => AnalyticsAutoRulesController(),
);