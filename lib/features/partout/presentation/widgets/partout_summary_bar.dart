import 'package:flutter/material.dart';

class PartOutSummaryBar extends StatelessWidget {
  final int visibleCount;
  final int totalCount;
  final String sortLabel;

  const PartOutSummaryBar({
    super.key,
    required this.visibleCount,
    required this.totalCount,
    required this.sortLabel,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(
            'Visible: $visibleCount / Total: $totalCount',
            style: const TextStyle(
              fontWeight: FontWeight.w700,
              color: Colors.white70,
            ),
          ),
        ),
        Text(
          'Sort: $sortLabel',
          style: const TextStyle(
            color: Colors.white60,
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}