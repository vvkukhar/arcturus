import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/sync/application/sync_health_center_provider.dart';

class SyncHealthCenterCard extends StatelessWidget {
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
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              model.headline,
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
                Chip(label: Text('Queue ${model.pendingQueueItems}')),
                Chip(label: Text('Conflicts ${model.pendingConflicts}')),
              ],
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                FilledButton.tonal(
                  onPressed: onOpenSyncQueue,
                  child: const Text('Open Sync Queue'),
                ),
                FilledButton.tonal(
                  onPressed: onOpenConflicts,
                  child: const Text('Open Conflicts'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}