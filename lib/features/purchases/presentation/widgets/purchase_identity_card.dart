import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchaseIdentityCard extends StatelessWidget {
  final PurchaseModel purchase;

  const PurchaseIdentityCard({
    super.key,
    required this.purchase,
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
              purchase.source,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Item ID: ${purchase.itemId}',
              style: const TextStyle(color: Colors.white70),
            ),
            if ((purchase.note ?? '').trim().isNotEmpty) ...[
              const SizedBox(height: 10),
              Text(purchase.note!.trim()),
            ],
          ],
        ),
      ),
    );
  }
}