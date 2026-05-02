import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_reprice_flow_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_top_reprice_candidates_provider.dart';

class RepriceQueueScreen extends ConsumerWidget {
  const RepriceQueueScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = ref.watch(inventoryTopRepriceCandidatesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Reprice Queue'),
      ),
      body: items.isEmpty
          ? const Center(
              child: Text('No repricing candidates right now.'),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final item = items[index];
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                item.title,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w800,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            Text(
                              item.score.toStringAsFixed(0),
                              style: const TextStyle(
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(item.reason),
                        const SizedBox(height: 10),
                        FilledButton(
                          onPressed: () {
                            ref
                                .read(inventoryRepriceFlowProvider.notifier)
                                .addItem(
                                  InventoryRepriceFlowItemModel(
                                    itemId: item.itemId,
                                    title: item.title,
                                    score: item.score,
                                    reason: item.reason,
                                  ),
                                );
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content:
                                    Text('${item.title} marked for repricing'),
                              ),
                            );
                          },
                          child: const Text('Mark for repricing'),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}