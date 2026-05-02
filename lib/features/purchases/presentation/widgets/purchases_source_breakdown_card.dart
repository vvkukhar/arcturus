import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_source_breakdown_provider.dart';

class PurchasesSourceBreakdownCard extends StatelessWidget {
  final List<PurchasesSourceBreakdownModel> items;

  const PurchasesSourceBreakdownCard({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return const SizedBox.shrink();
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Source Breakdown',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            ...items.take(6).map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        Expanded(child: Text(item.source)),
                        Text(
                          '${item.count} • ${item.totalSpend.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}