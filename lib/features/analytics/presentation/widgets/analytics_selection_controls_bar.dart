import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class AnalyticsSelectionControlsBar extends ConsumerWidget {
  final VoidCallback onSelectAll;
  final VoidCallback onClear;

  const AnalyticsSelectionControlsBar({
    super.key,
    required this.onSelectAll,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Row(
      children: [
        TextButton(
          onPressed: onSelectAll,
          child: Text(i18n.t('Select All')),
        ),
        const SizedBox(width: 8),
        TextButton(
          onPressed: onClear,
          child: Text(i18n.t('common.clear')),
        ),
      ],
    );
  }
}