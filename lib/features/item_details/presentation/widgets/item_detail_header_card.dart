// lib/features/item_details/presentation/widgets/item_detail_header_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/widgets/metric_chip.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';

class ItemDetailHeaderCard extends StatelessWidget {
  final ItemModel item;

  const ItemDetailHeaderCard({
    super.key,
    required this.item,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              item.title,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                MetricChip(label: 'type', value: item.type.name),
                MetricChip(label: 'status', value: item.status.name),
                MetricChip(label: 'own', value: item.ownershipType.name),
                if (item.theme != null)
                  MetricChip(label: 'theme', value: item.theme!),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
