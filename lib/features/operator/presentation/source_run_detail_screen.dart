import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/operator/data/operator_api_repository_provider.dart';

class SourceRunDetailScreen extends ConsumerWidget {
  final String runId;

  const SourceRunDetailScreen({
    super.key,
    required this.runId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final repository = ref.watch(operatorApiRepositoryProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Source Run Details'),
      ),
      body: FutureBuilder<Map<String, dynamic>?>(
        future: repository.getSourceRunDetails(runId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          final item = snapshot.data;
          if (item == null) {
            return const Center(child: Text('Run not found'));
          }
          final source =
              Map<String, dynamic>.from(item['source'] as Map? ?? {});
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
                        source['name'] as String? ?? '',
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text('Status: ${item['status'] ?? ''}'),
                      Text('Started: ${item['startedAt'] ?? '-'}'),
                      Text('Finished: ${item['finishedAt'] ?? '-'}'),
                      Text('Seen: ${item['itemsSeen'] ?? 0}'),
                      Text('Matched: ${item['itemsMatched'] ?? 0}'),
                      Text('Inserted: ${item['itemsInserted'] ?? 0}'),
                      Text('Updated: ${item['itemsUpdated'] ?? 0}'),
                      Text('Error: ${item['errorMessage'] ?? '-'}'),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
