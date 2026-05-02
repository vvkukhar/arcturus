import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_done_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_top_review_candidates_provider.dart';

class ReviewQueueScreen extends ConsumerWidget {
  const ReviewQueueScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = ref.watch(inventoryTopReviewCandidatesProvider);
    final done = ref.watch(inventoryReviewDoneProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Review Queue'),
      ),
      body: items.isEmpty
          ? const Center(
              child: Text('No review candidates right now.'),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final item = items[index];
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
                        if (isDone)
                          const Text(
                            'Review done',
                            style: TextStyle(
                              color: Colors.green,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            FilledButton(
                              onPressed: () {
                                ref
                                    .read(inventoryReviewDoneProvider.notifier)
                                    .markDone(item.itemId);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      '${item.title} marked as reviewed',
                                    ),
                                  ),
                                );
                              },
                              child: const Text('Mark review done'),
                            ),
                            TextButton(
                              onPressed: () {
                                ref
                                    .read(inventoryReviewDoneProvider.notifier)
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
              },
            ),
    );
  }
}