import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/data/inventory_api_repository_provider.dart';
import 'package:lego_trading_manager/features/opportunities/application/best_review_opportunities_provider.dart';
import 'package:lego_trading_manager/features/opportunities/presentation/profitability_breakdown_screen.dart';

class BestReviewOpportunitiesScreen extends ConsumerWidget {
  const BestReviewOpportunitiesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final opportunities = ref.watch(bestReviewOpportunitiesProvider);
    final inventoryRepository = ref.watch(inventoryApiRepositoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Best Review Opportunities'),
      ),
      body: opportunities.when(
        data: (items) {
          if (items.isEmpty) {
            return const Center(
              child: Text('No review opportunities'),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: items.length,
            itemBuilder: (context, index) {
              final item = items[index];

              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(14),
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
                      const SizedBox(height: 8),
                      Text(
                        'Cost ${item.totalCost.toStringAsFixed(2)} • Expected ${item.expectedSalePrice.toStringAsFixed(2)}',
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Median ${item.medianMarketPrice.toStringAsFixed(2)} • Gap ${item.marginGap.toStringAsFixed(2)}',
                      ),
                      const SizedBox(height: 4),
                      Text(item.reason),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              'Score ${item.reviewScore.toStringAsFixed(0)}',
                              style: const TextStyle(
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (_) => ProfitabilityBreakdownScreen(
                                    contextType: 'inventory',
                                    contextId: item.inventoryItemId,
                                  ),
                                ),
                              );
                            },
                            child: const Text('Breakdown'),
                          ),
                          FilledButton(
                            onPressed: () async {
                              await inventoryRepository.addToReviewFlow(
                                item.inventoryItemId,
                                item.reason,
                              );
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Added to review flow'),
                                  ),
                                );
                              }
                            },
                            child: const Text('Add'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, _) => Center(
          child: Text('Error: $error'),
        ),
      ),
    );
  }
}
