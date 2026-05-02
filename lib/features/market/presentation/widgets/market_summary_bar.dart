// lib/features/market/presentation/widgets/market_summary_bar.dart

import 'package:flutter/material.dart';

class MarketSummaryBar extends StatelessWidget {
  final int visibleCount;
  final int totalCount;
  final String sortLabel;

  const MarketSummaryBar({
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
