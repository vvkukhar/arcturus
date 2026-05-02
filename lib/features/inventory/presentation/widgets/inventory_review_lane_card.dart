import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_lane_model.dart';

class InventoryReviewLaneCard extends StatelessWidget {
  final InventoryReviewLaneModel model;

  const InventoryReviewLaneCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(label: Text('Urgent ${model.urgent}')),
            Chip(label: Text('Normal ${model.normal}')),
            Chip(label: Text('Backlog ${model.backlog}')),
          ],
        ),
      ),
    );
  }
}
