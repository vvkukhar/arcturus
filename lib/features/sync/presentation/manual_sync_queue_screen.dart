import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/sync/background_sync_service_provider.dart';
import 'package:lego_trading_manager/core/sync/sync_queue_repository_provider.dart';

class ManualSyncQueueScreen extends ConsumerStatefulWidget {
  const ManualSyncQueueScreen({super.key});

  @override
  ConsumerState<ManualSyncQueueScreen> createState() =>
      _ManualSyncQueueScreenState();
}

class _ManualSyncQueueScreenState extends ConsumerState<ManualSyncQueueScreen> {
  late Future<List<Map<String, dynamic>>> _future;

  @override
  void initState() {
    super.initState();
    _future = ref.read(syncQueueRepositoryProvider).getPending();
  }

  Future<void> _reload() async {
    setState(() {
      _future = ref.read(syncQueueRepositoryProvider).getPending();
    });
    await _future;
  }

  @override
  Widget build(BuildContext context) {
    final backgroundSync = ref.watch(backgroundSyncServiceProvider);
    final scaffoldMessenger = ScaffoldMessenger.of(context);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Manual Sync Queue')),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          await backgroundSync.flush();
          await _reload();

          if (!mounted) return;

          scaffoldMessenger.showSnackBar(
            SnackBar(
              content: Text(i18n.t('Sync queue flushed')),
            ),
          );
        },
        label: const Text('Flush'),
      ),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('${i18n.t('common.error', {'error': snapshot.error.toString()})}'));
          }

          final items = snapshot.data ?? [];

          if (items.isEmpty) {
            return RefreshIndicator(
              onRefresh: _reload,
              child: ListView(
                children: [
                  const SizedBox(height: 250),
                  Center(child: Text(i18n.t('Sync queue is empty'))),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: _reload,
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (context, index) {
                final item = items[index];
                return Card(
                  child: ListTile(
                    title: Text(item['endpoint'] as String? ?? ''),
                    subtitle: Text(
                      '${item['method']} • ${item['queueType']} • retries ${item['retryCount']}',
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}