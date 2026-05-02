import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';

class SaleIdentityCard extends StatelessWidget {
  final SaleModel sale;

  const SaleIdentityCard({
    super.key,
    required this.sale,
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
              sale.platform,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Item ID: ${sale.itemId}',
              style: const TextStyle(color: Colors.white70),
            ),
            if ((sale.buyerName ?? '').trim().isNotEmpty) ...[
              const SizedBox(height: 8),
              Text('Buyer: ${sale.buyerName!.trim()}'),
            ],
            if ((sale.note ?? '').trim().isNotEmpty) ...[
              const SizedBox(height: 10),
              Text(sale.note!.trim()),
            ],
          ],
        ),
      ),
    );
  }
}