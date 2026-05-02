import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_workload_model.dart';

class InventoryReviewWorkloadCard extends StatelessWidget {
  final InventoryReviewWorkloadModel model;

  const InventoryReviewWorkloadCard({
    super.key,
    required this.model,
  });

  Widget _cell(String label, String value) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.w800,
              fontSize: 15,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              model.label,
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Review items', model.totalReviewItems.toString()),
                _cell('Urgent', model.urgentItems.toString()),
                _cell('Moderate', model.moderateItems.toString()),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
