import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class DashboardOperatorShortcutsCard extends ConsumerWidget {
  final VoidCallback onOpenUnresolved;
  final VoidCallback onOpenSourceRuns;
  final VoidCallback onOpenSourceHealth;
  final VoidCallback onOpenSyncErrors;

  const DashboardOperatorShortcutsCard({
    super.key,
    required this.onOpenUnresolved,
    required this.onOpenSourceRuns,
    required this.onOpenSourceHealth,
    required this.onOpenSyncErrors,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            FilledButton.tonal(
              onPressed: onOpenUnresolved,
              child: Text(i18n.t('Unresolved Matches')),
            ),
            FilledButton.tonal(
              onPressed: onOpenSourceRuns,
              child: Text(i18n.t('Source Runs')),
            ),
            FilledButton.tonal(
              onPressed: onOpenSourceHealth,
              child: Text(i18n.t('Source Health')),
            ),
            FilledButton.tonal(
              onPressed: onOpenSyncErrors,
              child: Text(i18n.t('Sync Errors')),
            ),
          ],
        ),
      ),
    );
  }
}