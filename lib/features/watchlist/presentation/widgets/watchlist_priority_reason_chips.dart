import 'package:flutter/material.dart';

class WatchlistPriorityReasonChips extends StatelessWidget {
  final double spread;
  final double gap;
  final bool active;

  const WatchlistPriorityReasonChips({
    super.key,
    required this.spread,
    required this.gap,
    required this.active,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 6,
      runSpacing: 6,
      children: [
        if (active) const Chip(label: Text('Active boost')),
        if (spread > 0)
          Chip(label: Text('Spread +${spread.toStringAsFixed(0)}')),
        if (gap > 0)
          Chip(label: Text('Value gap +${gap.toStringAsFixed(0)}')),
      ],
    );
  }
}