import 'package:flutter/material.dart';

class GlobalSearchExactMatchBadge extends StatelessWidget {
  final bool exact;

  const GlobalSearchExactMatchBadge({
    super.key,
    required this.exact,
  });

  @override
  Widget build(BuildContext context) {
    if (!exact) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.green.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(999),
      ),
      child: const Text(
        'exact match',
        style: TextStyle(
          color: Colors.green,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
