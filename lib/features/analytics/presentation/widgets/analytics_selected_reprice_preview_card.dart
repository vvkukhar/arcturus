import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_selected_reprice_preview_model.dart';

class AnalyticsSelectedRepricePreviewCard extends ConsumerWidget {
  final AnalyticsSelectedRepricePreviewModel model;

  const AnalyticsSelectedRepricePreviewCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (model.count == 0) return const SizedBox.shrink();

    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${i18n.t('Selected items preview')} (${model.count})',
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            ...model.titles.take(6).map(
                  (title) => Padding(
                    padding: const EdgeInsets.only(bottom: 6),
                    child: Text('• $title'),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}