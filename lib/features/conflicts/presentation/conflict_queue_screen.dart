import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class ConflictQueueScreen extends ConsumerWidget {
  const ConflictQueueScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(syncEngineProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(i18n.t('sync.queue'), style: const TextStyle(fontWeight: FontWeight.w900))),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (state) {
          if (state.pendingMutations == 0) {
            return Center(child: Text(i18n.t('sync.allSync'), style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold)));
          }

          return ListView(
            padding: const EdgeInsets.all(16),
            physics: const BouncingScrollPhysics(),
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.orange.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(16)),
                child: Row(
                  children: [
                    const Icon(Icons.cloud_upload_outlined, color: Colors.orange, size: 32),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        i18n.t('sync.pending', {'count': state.pendingMutations.toString()}),
                        style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.orange),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}