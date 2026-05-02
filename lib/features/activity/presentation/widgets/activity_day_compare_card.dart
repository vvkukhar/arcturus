import 'package:flutter/material.dart';

class ActivityDayCompareCard extends StatelessWidget {
  final String bestLabel;
  final int bestCount;
  final String weakestLabel;
  final int weakestCount;

  const ActivityDayCompareCard({
    super.key,
    required this.bestLabel,
    required this.bestCount,
    required this.weakestLabel,
    required this.weakestCount,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'Best day',
                    style: TextStyle(color: Colors.white70),
                  ),
                ),
                Text(
                  '$bestLabel • $bestCount',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'Weakest day',
                    style: TextStyle(color: Colors.white70),
                  ),
                ),
                Text(
                  '$weakestLabel • $weakestCount',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
