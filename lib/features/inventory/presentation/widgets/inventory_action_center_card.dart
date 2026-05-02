import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_center_provider.dart';

class InventoryActionCenterCard extends StatelessWidget {
  final InventoryActionCenterModel model;

  const InventoryActionCenterCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Action Center',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                Chip(label: Text('Buy ${model.buy}')),
                Chip(label: Text('Sell ${model.sell}')),
                Chip(label: Text('Reprice ${model.reprice}')),
                Chip(label: Text('Review ${model.review}')),
                Chip(label: Text('Hold ${model.hold}')),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              'Top action: ${model.topLabel}',
              style: const TextStyle(
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}