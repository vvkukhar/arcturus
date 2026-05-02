import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';

class SaleTimelineCard extends StatelessWidget {
  final SaleModel sale;

  const SaleTimelineCard({
    super.key,
    required this.sale,
  });

  @override
  Widget build(BuildContext context) {
    final date = sale.saleDate.toIso8601String().split('T').first;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            const Icon(Icons.timeline_outlined),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Sold on $date',
                style: const TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
          ],
        ),
      ),
    );
  }
}