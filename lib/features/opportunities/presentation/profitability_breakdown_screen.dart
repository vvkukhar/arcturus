import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/opportunities/application/profitability_breakdown_provider.dart';

class ProfitabilityBreakdownScreen extends ConsumerWidget {
  final String contextType;
  final String contextId;

  const ProfitabilityBreakdownScreen({
    super.key,
    required this.contextType,
    required this.contextId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final breakdown = ref.watch(
      profitabilityBreakdownProvider((
        contextType: contextType,
        contextId: contextId,
      )),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profitability Breakdown'),
      ),
      body: breakdown.when(
        data: (item) {
          if (item == null) {
            return const Center(
              child: Text('No breakdown available'),
            );
          }

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Card(
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
                      const SizedBox(height: 10),
                      Text('Buy price: ${item.buyPrice.toStringAsFixed(2)}'),
                      Text('Shipping: ${item.shippingCost.toStringAsFixed(2)}'),
                      Text(
                          'Packaging: ${item.packagingCost.toStringAsFixed(2)}'),
                      Text(
                          'Target sell: ${item.targetSellPrice.toStringAsFixed(2)}'),
                      Text(
                          'Total entry: ${item.totalEntryCost.toStringAsFixed(2)}'),
                      Text(
                          'Gross revenue: ${item.grossRevenue.toStringAsFixed(2)}'),
                      Text('Total fees: ${item.totalFees.toStringAsFixed(2)}'),
                      Text(
                          'Net revenue: ${item.netRevenue.toStringAsFixed(2)}'),
                      const SizedBox(height: 8),
                      Text(
                        'Net profit: ${item.netProfit.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      Text(
                        'ROI: ${item.roiPercent.toStringAsFixed(2)}%',
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
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
