import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rule_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rules_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_preset_persistence_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_preset_model.dart';

class AnalyticsRulePresetsService {
  final Ref ref;

  AnalyticsRulePresetsService(this.ref);

  void applyPreset(AnalyticsRulePresetModel preset) {
    final current = ref.read(analyticsAutoRulesProvider);

    final next = <AnalyticsAutoRuleModel>[
      for (final item in current)
        item.copyWith(enabled: preset.enabledRuleIds.contains(item.id)),
    ];

    ref.read(analyticsAutoRulesProvider.notifier).replaceAll(next);
    ref.read(analyticsPresetPersistenceProvider.notifier).state = preset.id;
  }
}