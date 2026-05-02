import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/operator/data/operator_api_repository_provider.dart';
import 'package:lego_trading_manager/features/operator/presentation/source_run_detail_screen.dart';

class SourceRunHistoryScreen extends ConsumerStatefulWidget {
  const SourceRunHistoryScreen({super.key});

  @override
  ConsumerState<SourceRunHistoryScreen> createState() =>
      _SourceRunHistoryScreenState();
}

class _SourceRunHistoryScreenState
    extends ConsumerState<SourceRunHistoryScreen> {
  late Future<List<Map<String, dynamic>>> _future;

  @override
  void initState() {
    super.initState();
    _future = ref.read(operatorApiRepositoryProvider).getSourceRunHistory();
  }

  Future<void> _reload() async {
    setState(() {
      _future = ref.read(operatorApiRepositoryProvider).getSourceRunHistory();
    });
    await _future;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Source Run History'),
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
                  Center(child: Text('No source runs')),
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
                final source = Map<String, dynamic>.from(
                  item['source'] as Map? ?? {},
                );
                final runId = item['id'] as String? ?? '';
                return Card(
                  child: ListTile(
                    title: Text(
                      source['name'] as String? ?? '',
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    subtitle: Text(
                      'Status: ${item['status'] ?? ''} • Seen: ${item['itemsSeen'] ?? 0}',
                    ),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => SourceRunDetailScreen(runId: runId),
                        ),
                      );
                    },
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
