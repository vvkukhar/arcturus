import 'package:flutter/material.dart';

class GlobalSearchSectionScoreBadge extends StatelessWidget {
  final int score;

  const GlobalSearchSectionScoreBadge({
    super.key,
    required this.score,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.blue.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        score.toString(),
        style: const TextStyle(
          color: Colors.blue,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}