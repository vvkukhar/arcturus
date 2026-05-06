import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
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
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Best Sell Opportunities')),
      ),
      body: opportunities.when(
        data: (items) {
          if (items.isEmpty) {
            return Center(
              child: Text(i18n.t('No sell opportunities')),
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
                        '${i18n.t('Sell')} ${item.targetSellPrice.toStringAsFixed(2)} • Cost basis ${item.totalCostBasis.toStringAsFixed(2)}',
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${i18n.t('Profit')} ${item.profit.toStringAsFixed(2)} • ROI ${item.roi.toStringAsFixed(2)}% • ${i18n.t('Margin')} ${item.marginPercent.toStringAsFixed(2)}%',
                      ),
                      const SizedBox(height: 4),
                      Text('${i18n.t(item.action)} • ${i18n.t(item.actionReasonPrimary)}'),
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
                              SnackBar(
                                content: Text(i18n.t('Added to reprice flow')),
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
          child: Text('${i18n.t('common.error', {'error': error.toString()})}'),
        ),
      ),
    );
  }
}