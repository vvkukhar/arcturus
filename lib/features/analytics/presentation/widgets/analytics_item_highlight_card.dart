// lib/features/analytics/presentation/widgets/analytics_item_highlight_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';

class AnalyticsItemHighlightCard extends StatelessWidget {
  final ItemModel item;
  final String trailingText;
  final String subtitleText;

  const AnalyticsItemHighlightCard({
    super.key,
    required this.item,
    required this.trailingText,
    required this.subtitleText,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(item.title),
        subtitle: Text(subtitleText),
        trailing: Text(
          trailingText,
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}
