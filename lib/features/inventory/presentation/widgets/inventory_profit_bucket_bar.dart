import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_profit_bucket_model.dart';

class InventoryProfitBucketBar extends StatelessWidget {
  final InventoryProfitBucketModel model;

  const InventoryProfitBucketBar({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          children: [
            Chip(label: Text('Low: ${model.low}')),
            Chip(label: Text('Mid: ${model.medium}')),
            Chip(label: Text('High: ${model.high}')),
          ],
        ),
      ),
    );
  }
}
