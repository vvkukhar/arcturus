import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/sync/application/item_sync_status_provider.dart';

class StaleSnapshotWarningCard extends ConsumerWidget {
  final ItemSyncStatusModel model;

  const StaleSnapshotWarningCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (!model.needsRefresh) {
      return const SizedBox.shrink();
    }
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            const Icon(Icons.warning_amber_rounded),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Snapshot is ${model.snapshotFreshnessLabel}. Refresh is recommended.',
              ),
            ),
          ],
        ),
      ),
    );
  }
}