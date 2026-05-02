// lib/features/item_details/presentation/widgets/item_detail_insight_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/item_details/application/item_detail_insight_model.dart';

class ItemDetailInsightCard extends StatelessWidget {
  final ItemDetailInsightModel insight;

  const ItemDetailInsightCard({
    super.key,
    required this.insight,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(insight.title),
            const SizedBox(height: 8),
            Text(
              insight.value,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              insight.subtitle,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}
