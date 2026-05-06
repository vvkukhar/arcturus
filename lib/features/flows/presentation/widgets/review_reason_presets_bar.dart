import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class ReviewReasonPresetsBar extends ConsumerWidget {
  final ValueChanged<String> onSelect;

  const ReviewReasonPresetsBar({
    super.key,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final presets = [
      'Weak margin',
      'Need photo check',
      'Need set verification',
      'Need price validation',
      'Need condition check',
    ];

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: presets
          .map(
            (preset) => ActionChip(
              label: Text(i18n.t(preset)),
              onPressed: () => onSelect(i18n.t(preset)),
            ),
          )
          .toList(),
    );
  }
}