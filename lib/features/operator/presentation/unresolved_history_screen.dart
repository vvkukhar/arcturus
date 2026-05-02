import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/operator/data/operator_api_repository_provider.dart';

class UnresolvedHistoryScreen extends ConsumerWidget {
  final String status;

  const UnresolvedHistoryScreen({super.key, required this.status});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final repo = ref.watch(operatorApiRepositoryProvider);
    return Scaffold(
      appBar: AppBar(title: Text('History: $status')),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: repo.getUnresolvedMatches(status: status),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }
          final items = snapshot.data!;
          if (items.isEmpty) {
            return const Center(child: Text('Empty'));
          }
          return ListView.builder(
            itemCount: items.length,
            itemBuilder: (_, i) {
              final item = items[i];
              return ListTile(
                title: Text(item['titleRaw'] ?? ''),
                subtitle: Text(item['operatorNote'] ?? ''),
              );
            },
          );
        },
      ),
    );
  }
}
