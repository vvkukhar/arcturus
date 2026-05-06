import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class ActivityTimelineEmptyState extends ConsumerWidget {
  final VoidCallback onShowAll;
  final VoidCallback onShowReports;
  final VoidCallback onShowPurchases;

  const ActivityTimelineEmptyState({
    super.key,
    required this.onShowAll,
    required this.onShowReports,
    required this.onShowPurchases,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Center(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                i18n.t('activity.timeline.empty'),
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  FilledButton.tonal(
                    onPressed: onShowAll,
                    child: Text(i18n.t('Show All')),
                  ),
                  FilledButton.tonal(
                    onPressed: onShowReports,
                    child: Text(i18n.t('Reports')),
                  ),
                  FilledButton.tonal(
                    onPressed: onShowPurchases,
                    child: Text(i18n.t('Purchases')),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}