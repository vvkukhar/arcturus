import 'package:flutter/material.dart';

class ActivityInsightStackCard extends StatelessWidget {
  final String momentum;
  final String balance;
  final String streakLabel;

  const ActivityInsightStackCard({
    super.key,
    required this.momentum,
    required this.balance,
    required this.streakLabel,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Insight Stack',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            Text('Momentum • $momentum'),
            const SizedBox(height: 6),
            Text('Balance • $balance'),
            const SizedBox(height: 6),
            Text('Streak • $streakLabel'),
          ],
        ),
      ),
    );
  }
}
