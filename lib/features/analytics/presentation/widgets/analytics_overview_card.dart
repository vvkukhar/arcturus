import 'package:flutter/material.dart';

class AnalyticsOverviewCard extends StatelessWidget {
  final int soldCount;
  final int activeCount;
  final int deadStockCount;

  const AnalyticsOverviewCard({
    super.key,
    required this.soldCount,
    required this.activeCount,
    required this.deadStockCount,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _row('Sold count', soldCount.toString()),
            const SizedBox(height: 8),
            _row('Active count', activeCount.toString()),
            const SizedBox(height: 8),
            _row('Dead stock count', deadStockCount.toString()),
          ],
        ),
      ),
    );
  }

  Widget _row(String label, String value) {
    return Row(
      children: [
        Expanded(child: Text(label)),
        Text(
          value,
          style: const TextStyle(fontWeight: FontWeight.w700),
        ),
      ],
    );
  }
}
