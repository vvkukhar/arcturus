import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/operator/application/unresolved_summary_provider.dart';

class DashboardUnresolvedMatchCard extends ConsumerWidget {
  final UnresolvedSummaryModel model;

  const DashboardUnresolvedMatchCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final headline =
        model.pending > 0 ? 'Operator review needed' : 'No unresolved matches';
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t(headline),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                Chip(label: Text('${i18n.t('Pending')} ${model.pending}')),
                Chip(label: Text('${i18n.t('Resolved')} ${model.resolved}')),
                Chip(label: Text('${i18n.t('Dismissed')} ${model.dismissed}')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}