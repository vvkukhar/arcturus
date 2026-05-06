import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class DashboardFlowShortcutsCard extends ConsumerWidget {
  final VoidCallback onOpenPurchase;
  final VoidCallback onOpenReprice;
  final VoidCallback onOpenReview;

  const DashboardFlowShortcutsCard({
    super.key,
    required this.onOpenPurchase,
    required this.onOpenReprice,
    required this.onOpenReview,
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
              onPressed: onOpenPurchase,
              child: Text(i18n.t('Purchase Flow')),
            ),
            FilledButton.tonal(
              onPressed: onOpenReprice,
              child: Text(i18n.t('Reprice Flow')),
            ),
            FilledButton.tonal(
              onPressed: onOpenReview,
              child: Text(i18n.t('Review Flow')),
            ),
          ],
        ),
      ),
    );
  }
}