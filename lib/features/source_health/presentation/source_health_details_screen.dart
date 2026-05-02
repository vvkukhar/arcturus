import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/source_health/data/source_health_api_repository_provider.dart';

class SourceHealthDetailsScreen extends ConsumerStatefulWidget {
  const SourceHealthDetailsScreen({super.key});

  @override
  ConsumerState<SourceHealthDetailsScreen> createState() =>
      _SourceHealthDetailsScreenState();
}

class _SourceHealthDetailsScreenState
    extends ConsumerState<SourceHealthDetailsScreen> {
  late Future<List<Map<String, dynamic>>> _future;

  @override
  void initState() {
    super.initState();
    _future = ref.read(sourceHealthApiRepositoryProvider).getSummary();
  }

  Future<void> _reload() async {
    setState(() {
      _future = ref.read(sourceHealthApiRepositoryProvider).getSummary();
    });
    await _future;
  }

  @override
  Widget build(BuildContext context) {
    final repository = ref.watch(sourceHealthApiRepositoryProvider);
    final scaffoldMessenger = ScaffoldMessenger.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Source Health Details'),
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
                  Center(child: Text('No source health data')),
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
                final sourceCode = item['sourceCode'] as String? ?? '';

                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item['sourceName'] as String? ?? '',
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text('Code: $sourceCode'),
                        Text('Enabled: ${item['enabled']}'),
                        Text('Listings: ${item['listingCount']}'),
                        Text('Freshness: ${item['freshnessLabel']}'),
                        Text('Latest run: ${item['latestRunStatus']}'),
                        if (item['latestErrorMessage'] != null)
                          Text('Latest error: ${item['latestErrorMessage']}'),
                        const SizedBox(height: 12),
                        FilledButton.tonal(
                          onPressed: () async {
                            await repository.triggerRerun(sourceCode);
                            await _reload();

                            if (!mounted) return;

                            scaffoldMessenger.showSnackBar(
                              SnackBar(
                                content: Text(
                                  'Rerun requested for $sourceCode',
                                ),
                              ),
                            );
                          },
                          child: const Text('Re-run source'),
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