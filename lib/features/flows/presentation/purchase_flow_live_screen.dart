import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/flows/data/flows_api_repository_provider.dart';

class PurchaseFlowLiveScreen extends ConsumerWidget {
  const PurchaseFlowLiveScreen({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final repository = ref.watch(flowsApiRepositoryProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Purchase Flow Live')),
      body: FutureBuilder(
        future: repository.getPurchaseFlow(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          final items = snapshot.data ?? [];
          if (items.isEmpty) {
            return const Center(child: Text('Empty purchase flow'));
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
                        child:
                            Text(item['watchlistItem']['titleSnapshot'] ?? ''),
                      ),
                      FilledButton(
                        onPressed: () async {
                          await repository.updatePurchaseStatus(
                            item['id'],
                            'bought',
                          );
                        },
                        child: const Text('Bought'),
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
