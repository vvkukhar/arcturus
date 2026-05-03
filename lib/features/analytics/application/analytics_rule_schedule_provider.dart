import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_schedule_model.dart';

class AnalyticsRuleScheduleController extends Notifier<AnalyticsRuleScheduleModel> {
  @override
  AnalyticsRuleScheduleModel build() {
    return const AnalyticsRuleScheduleModel(
      enabled: false,
      frequencyLabel: 'manual',
    );
  }

  void toggle(bool value) {
    state = state.copyWith(enabled: value);
  }

  void setFrequency(String value) {
    state = state.copyWith(frequencyLabel: value);
  }
}

final analyticsRuleScheduleProvider = NotifierProvider<
    AnalyticsRuleScheduleController, AnalyticsRuleScheduleModel>(
  AnalyticsRuleScheduleController.new,
);