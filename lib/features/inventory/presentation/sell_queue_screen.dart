import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_top_sell_candidates_provider.dart';

class SellQueueScreen extends ConsumerWidget {
  const SellQueueScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = ref.watch(inventoryTopSellCandidatesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sell Queue'),
      ),
      body: items.isEmpty
          ? const Center(
              child: Text('No sell candidates right now.'),
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
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.title,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w800,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Text(item.reason),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          item.score.toStringAsFixed(0),
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                          ),
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