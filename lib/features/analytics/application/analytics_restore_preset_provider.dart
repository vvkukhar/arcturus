import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_preset_persistence_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_preset_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_presets_provider.dart';

final analyticsRestorePresetProvider = Provider<void Function()>((ref) {
  return () {
    final savedId = ref.read(analyticsPresetPersistenceProvider);
    if (savedId == null) return;
    for (final preset in AnalyticsRulePresetModel.presets) {
      if (preset.id != savedId) continue;
      ref.read(analyticsRulePresetsProvider).applyPreset(preset);
      break;
    }
  };
});
