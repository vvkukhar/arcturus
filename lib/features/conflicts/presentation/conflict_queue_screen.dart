import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class ConflictQueueScreen extends ConsumerWidget {
  const ConflictQueueScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(syncEngineProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Sync Queue', style: TextStyle(fontWeight: FontWeight.w900))),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (state) {
          if (state.pendingMutations == 0) {
            return const Center(child: Text('All data is synchronized.', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)));
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
                        '${state.pendingMutations} mutations pending synchronization.',
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