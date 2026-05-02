import 'package:flutter/material.dart';

class PurchasesTotalSpendCard extends StatelessWidget {
  final double totalSpend;
  final double visibleSpend;
  final String currency;

  const PurchasesTotalSpendCard({
    super.key,
    required this.totalSpend,
    required this.visibleSpend,
    required this.currency,
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
              fontSize: 16,
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
        child: Row(
          children: [
            _cell('Total spend', '${totalSpend.toStringAsFixed(2)} $currency'),
            _cell(
              'Visible spend',
              '${visibleSpend.toStringAsFixed(2)} $currency',
            ),
          ],
        ),
      ),
    );
  }
}