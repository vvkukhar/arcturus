import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/flows/data/flows_api_repository_provider.dart';

class RepriceFlowLiveScreen extends ConsumerWidget {
  const RepriceFlowLiveScreen({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final repository = ref.watch(flowsApiRepositoryProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Reprice Flow Live')),
      body: FutureBuilder(
        future: repository.getRepriceFlow(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          final items = snapshot.data ?? [];
          if (items.isEmpty) {
            return const Center(child: Text('Empty reprice flow'));
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: items.length,
            itemBuilder: (context, index) {
              final item = items[index];
              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          item['inventoryItem']['titleSnapshot'] ?? '',
                        ),
                      ),
                      FilledButton(
                        onPressed: () async {
                          await repository.updateRepriceStatus(
                            item['id'],
                            'done',
                          );
                        },
                        child: const Text('Done'),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
