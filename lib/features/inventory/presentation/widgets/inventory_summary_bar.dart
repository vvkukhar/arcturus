import 'package:flutter/material.dart';

class InventorySummaryBar extends StatelessWidget {
  final int totalCount;
  final int visibleCount;
  final String sortLabel;

  const InventorySummaryBar({
    super.key,
    required this.totalCount,
    required this.visibleCount,
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
            ),
          ),
        ),
        Text(
          'Sort: $sortLabel',
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ],
    );
  }
}