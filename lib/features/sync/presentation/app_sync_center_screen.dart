import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/conflicts/presentation/conflict_queue_screen.dart';
import 'package:lego_trading_manager/features/sync/application/sync_health_center_provider.dart';
import 'package:lego_trading_manager/features/sync/presentation/manual_sync_queue_screen.dart';

class AppSyncCenterScreen extends ConsumerWidget {
  const AppSyncCenterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final health = ref.watch(syncHealthCenterProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('App Sync Center')),
      ),
      body: health.when(
        data: (data) {
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        data.headline,
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text('Pending queue: ${data.pendingQueueItems}'),
                      Text('Pending conflicts: ${data.pendingConflicts}'),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              FilledButton.tonal(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const ManualSyncQueueScreen(),
                    ),
                  );
                },
                child: Text(i18n.t('Open Manual Sync Queue')),
              ),
              const SizedBox(height: 12),
              FilledButton.tonal(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const ConflictQueueScreen(),
                    ),
                  );
                },
                child: Text(i18n.t('Open Conflict Queue')),
              ),
            ],
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, _) => Center(
          child: Text('${i18n.t('common.error', {'error': error.toString()})}'),
        ),
      ),
    );
  }
}