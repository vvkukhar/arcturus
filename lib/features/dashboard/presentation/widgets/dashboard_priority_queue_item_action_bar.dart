import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class DashboardPriorityQueueItemActionBar extends ConsumerWidget {
  final VoidCallback onDone;
  final VoidCallback onSkip;
  final VoidCallback onReset;

  const DashboardPriorityQueueItemActionBar({
    super.key,
    required this.onDone,
    required this.onSkip,
    required this.onReset,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        FilledButton.tonal(
          onPressed: onDone,
          child: Text(i18n.t('Done')),
        ),
        FilledButton.tonal(
          onPressed: onSkip,
          child: Text(i18n.t('Skip')),
        ),
        TextButton(
          onPressed: onReset,
          child: Text(i18n.t('common.clear')),
        ),
      ],
    );
  }
}