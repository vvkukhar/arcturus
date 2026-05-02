import 'package:flutter/material.dart';

class MarketNoteSummaryBar extends StatelessWidget {
  final int visibleCount;
  final int totalCount;

  const MarketNoteSummaryBar({
    super.key,
    required this.visibleCount,
    required this.totalCount,
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
      ],
    );
  }
}