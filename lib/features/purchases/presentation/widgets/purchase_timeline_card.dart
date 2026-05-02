import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchaseTimelineCard extends StatelessWidget {
  final PurchaseModel purchase;

  const PurchaseTimelineCard({
    super.key,
    required this.purchase,
  });

  @override
  Widget build(BuildContext context) {
    final date = purchase.purchaseDate.toIso8601String().split('T').first;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            const Icon(Icons.timeline_outlined),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Purchased on $date',
                style: const TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
          ],
        ),
      ),
    );
  }
}