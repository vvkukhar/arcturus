import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_reprice_flow_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/reprice_flow_done_provider.dart';

class RepriceFlowScreen extends ConsumerWidget {
  const RepriceFlowScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = ref.watch(inventoryRepriceFlowProvider);
    final done = ref.watch(repriceFlowDoneProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Reprice Flow'),
      ),
      body: items.isEmpty
          ? const Center(child: Text('Reprice flow is empty.'))
          : ListView(
              padding: const EdgeInsets.all(16),
              children: items.map((item) {
                final isDone = done.contains(item.itemId);
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
                                ),
                              ),
                            ),
                            if (isDone)
                              const Text(
                                'DONE',
                                style: TextStyle(
                                  color: Colors.green,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(item.reason),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          children: [
                            FilledButton(
                              onPressed: () {
                                ref
                                    .read(repriceFlowDoneProvider.notifier)
                                    .markDone(item.itemId);
                              },
                              child: const Text('Mark done'),
                            ),
                            TextButton(
                              onPressed: () {
                                ref
                                    .read(repriceFlowDoneProvider.notifier)
                                    .unmark(item.itemId);
                              },
                              child: const Text('Undo'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
    );
  }
}