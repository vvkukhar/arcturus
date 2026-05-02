import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/conflicts/conflict_repository_provider.dart';

class ConflictQueueScreen extends ConsumerStatefulWidget {
  const ConflictQueueScreen({super.key});

  @override
  ConsumerState<ConflictQueueScreen> createState() =>
      _ConflictQueueScreenState();
}

class _ConflictQueueScreenState extends ConsumerState<ConflictQueueScreen> {
  late Future<List<Map<String, dynamic>>> _future;

  @override
  void initState() {
    super.initState();
    _future = ref.read(conflictRepositoryProvider).getPending();
  }

  Future<void> _reload() async {
    setState(() {
      _future = ref.read(conflictRepositoryProvider).getPending();
    });
    await _future;
  }

  @override
  Widget build(BuildContext context) {
    final repository = ref.watch(conflictRepositoryProvider);
    final scaffoldMessenger = ScaffoldMessenger.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Conflict Queue'),
      ),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final items = snapshot.data ?? [];

          if (items.isEmpty) {
            return RefreshIndicator(
              onRefresh: _reload,
              child: ListView(
                children: const [
                  SizedBox(height: 250),
                  Center(child: Text('No pending conflicts')),
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
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${item['entityType']} • ${item['entityId']}',
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text('Local: ${item['localJson']}'),
                        const SizedBox(height: 8),
                        Text('Remote: ${item['remoteJson']}'),
                        const SizedBox(height: 10),
                        FilledButton(
                          onPressed: () async {
                            await repository.resolve(item['id'] as String);
                            await _reload();

                            if (!mounted) {
                              return;
                            }

                            scaffoldMessenger.showSnackBar(
                              const SnackBar(
                                content: Text('Conflict resolved'),
                              ),
                            );
                          },
                          child: const Text('Mark resolved'),
                        ),
                      ],
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