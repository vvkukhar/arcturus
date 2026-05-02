import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_preset_model.dart';

class AnalyticsRulePresetsBar extends StatelessWidget {
  final ValueChanged<AnalyticsRulePresetModel> onApply;

  const AnalyticsRulePresetsBar({
    super.key,
    required this.onApply,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: AnalyticsRulePresetModel.presets.map((preset) {
            return ActionChip(
              label: Text(preset.title),
              onPressed: () => onApply(preset),
            );
          }).toList(),
        ),
      ),
    );
  }
}
