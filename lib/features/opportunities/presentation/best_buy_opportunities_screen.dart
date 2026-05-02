import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/flows/application/purchase_flow_provider.dart';
import 'package:lego_trading_manager/features/flows/data/flows_api_repository_provider.dart';
import 'package:lego_trading_manager/features/opportunities/application/best_buy_opportunities_provider.dart';
import 'package:lego_trading_manager/features/opportunities/presentation/widgets/buy_opportunity_actions_bar.dart';

class BestBuyOpportunitiesScreen extends ConsumerWidget {
  const BestBuyOpportunitiesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final opportunities = ref.watch(bestBuyOpportunitiesProvider);
    final flowsRepository = ref.watch(flowsApiRepositoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Best Buy Opportunities'),
      ),
      body: opportunities.when(
        data: (items) {
          if (items.isEmpty) {
            return const Center(
              child: Text('No buy opportunities'),
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
                        'Buy ${item.totalBuy.toStringAsFixed(2)} • Target ${item.targetSellPrice.toStringAsFixed(2)}',
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Profit ${item.profit.toStringAsFixed(2)} • ROI ${item.roi.toStringAsFixed(2)}% • Margin ${item.marginPercent.toStringAsFixed(2)}%',
                      ),
                      const SizedBox(height: 4),
                      Text('${item.action} • ${item.actionReasonPrimary}'),
                      const SizedBox(height: 4),
                      Text(
                          '${item.type} • ${item.freshness} • ${item.sourceCode}'),
                      const SizedBox(height: 8),
                      Text(
                        'Score ${item.score.toStringAsFixed(0)}',
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 10),
                      BuyOpportunityActionsBar(
                        id: item.watchlistItemId,
                        onAdd: () async {
                          await flowsRepository
                              .addToPurchaseFlow(item.watchlistItemId);
                          ref.invalidate(purchaseFlowProvider);
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Added to purchase flow'),
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
