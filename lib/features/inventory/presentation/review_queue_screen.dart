import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_done_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_top_review_candidates_provider.dart';

class ReviewQueueScreen extends ConsumerWidget {
  const ReviewQueueScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = ref.watch(inventoryTopReviewCandidatesProvider);
    final done = ref.watch(inventoryReviewDoneProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Review Queue')),
      ),
      body: items.isEmpty
          ? Center(
              child: Text(i18n.t('No review candidates right now.')),
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
                        Text(i18n.t(item.reason)),
                        const SizedBox(height: 10),
                        if (isDone)
                          Text(
                            i18n.t('Review done'),
                            style: const TextStyle(
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
                                      '${item.title} ${i18n.t('marked as reviewed')}',
                                    ),
                                  ),
                                );
                              },
                              child: Text(i18n.t('Mark review done')),
                            ),
                            TextButton(
                              onPressed: () {
                                ref
                                    .read(inventoryReviewDoneProvider.notifier)
                                    .unmark(item.itemId);
                              },
                              child: Text(i18n.t('Undo')),
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