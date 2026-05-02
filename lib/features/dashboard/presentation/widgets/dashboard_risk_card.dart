import 'package:flutter/material.dart';

class DashboardRiskCard extends StatelessWidget {
  final int riskyItems;

  const DashboardRiskCard({
    super.key,
    required this.riskyItems,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.red.withValues(alpha: 0.08),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            const Icon(Icons.warning_amber_rounded, color: Colors.red),
            const SizedBox(width: 10),
            Text(
              '$riskyItems risky items',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
