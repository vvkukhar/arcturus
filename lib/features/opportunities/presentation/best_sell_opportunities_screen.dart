import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/flows/application/reprice_flow_provider.dart';
import 'package:lego_trading_manager/features/flows/data/flows_api_repository_provider.dart';
import 'package:lego_trading_manager/features/opportunities/application/best_sell_opportunities_provider.dart';
import 'package:lego_trading_manager/features/opportunities/presentation/widgets/sell_opportunity_actions_bar.dart';

class BestSellOpportunitiesScreen extends ConsumerWidget {
  const BestSellOpportunitiesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final opportunities = ref.watch(bestSellOpportunitiesProvider);
    final flowsRepository = ref.watch(flowsApiRepositoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Best Sell Opportunities'),
      ),
      body: opportunities.when(
        data: (items) {
          if (items.isEmpty) {
            return const Center(
              child: Text('No sell opportunities'),
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
                        'Sell ${item.targetSellPrice.toStringAsFixed(2)} • Cost basis ${item.totalCostBasis.toStringAsFixed(2)}',
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Profit ${item.profit.toStringAsFixed(2)} • ROI ${item.roi.toStringAsFixed(2)}% • Margin ${item.marginPercent.toStringAsFixed(2)}%',
                      ),
                      const SizedBox(height: 4),
                      Text('${item.action} • ${item.actionReasonPrimary}'),
                      const SizedBox(height: 4),
                      Text(
                          'Confidence ${item.confidenceScore.toStringAsFixed(2)}'),
                      const SizedBox(height: 8),
                      Text(
                        'Score ${item.score.toStringAsFixed(0)}',
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 10),
                      SellOpportunityActionsBar(
                        id: item.inventoryItemId,
                        onAction: () async {
                          await flowsRepository
                              .addToRepriceFlow(item.inventoryItemId);
                          ref.invalidate(repriceFlowProvider);
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Added to reprice flow'),
                              ),
                            );
                          }
                        },
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
