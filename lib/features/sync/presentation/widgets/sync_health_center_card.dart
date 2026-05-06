import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/sync/application/sync_health_center_provider.dart';

class SyncHealthCenterCard extends ConsumerWidget {
  final SyncHealthCenterModel model;
  final VoidCallback onOpenSyncQueue;
  final VoidCallback onOpenConflicts;

  const SyncHealthCenterCard({
    super.key,
    required this.model,
    required this.onOpenSyncQueue,
    required this.onOpenConflicts,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t(model.headline),
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
                Chip(label: Text('${i18n.t('Queue')} ${model.pendingQueueItems}')),
                Chip(label: Text('${i18n.t('Conflicts')} ${model.pendingConflicts}')),
              ],
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                FilledButton.tonal(
                  onPressed: onOpenSyncQueue,
                  child: Text(i18n.t('Open Sync Queue')),
                ),
                FilledButton.tonal(
                  onPressed: onOpenConflicts,
                  child: Text(i18n.t('Open Conflicts')),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}