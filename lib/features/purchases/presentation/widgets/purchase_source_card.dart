import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchaseSourceCard extends StatelessWidget {
  final PurchaseModel purchase;

  const PurchaseSourceCard({
    super.key,
    required this.purchase,
  });

  Widget _row(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(
                color: Colors.white70,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _row('Source', purchase.source),
            _row('Source URL', purchase.sourceUrl ?? '-'),
            _row('Seller', purchase.sellerName ?? '-'),
            _row('Contact', purchase.sellerContact ?? '-'),
          ],
        ),
      ),
    );
  }
}