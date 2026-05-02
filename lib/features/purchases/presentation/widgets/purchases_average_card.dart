import 'package:flutter/material.dart';

class PurchasesAverageCard extends StatelessWidget {
  final double averagePurchase;
  final double averageShipping;
  final String currency;

  const PurchasesAverageCard({
    super.key,
    required this.averagePurchase,
    required this.averageShipping,
    required this.currency,
  });

  Widget _row(String label, double value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            '${value.toStringAsFixed(2)} $currency',
            style: const TextStyle(fontWeight: FontWeight.w800),
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
          children: [
            _row('Average purchase', averagePurchase),
            _row('Average shipping', averageShipping),
          ],
        ),
      ),
    );
  }
}