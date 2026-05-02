import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_execution_history_entry_model.dart';

class AnalyticsRuleExecutionHistoryController
    extends StateNotifier<List<AnalyticsRuleExecutionHistoryEntryModel>> {
  AnalyticsRuleExecutionHistoryController() : super(const []);

  void add(AnalyticsRuleExecutionHistoryEntryModel entry) {
    state = [entry, ...state].take(20).toList();
  }

  void clear() {
    state = const [];
  }
}

final analyticsRuleExecutionHistoryProvider = StateNotifierProvider<
    AnalyticsRuleExecutionHistoryController,
    List<AnalyticsRuleExecutionHistoryEntryModel>>(
  (ref) => AnalyticsRuleExecutionHistoryController(),
);
