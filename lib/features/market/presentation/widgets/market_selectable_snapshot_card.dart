// lib/features/market/presentation/widgets/market_selectable_snapshot_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';

class MarketSelectableSnapshotCard extends StatelessWidget {
  final MarketSnapshotModel snapshot;
  final String itemTitle;
  final bool selected;
  final VoidCallback onTap;
  final VoidCallback onToggleSelection;

  const MarketSelectableSnapshotCard({
    super.key,
    required this.snapshot,
    required this.itemTitle,
    required this.selected,
    required this.onTap,
    required this.onToggleSelection,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: onTap,
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    itemTitle,
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text('Source: ${snapshot.source}'),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 12,
                    runSpacing: 8,
                    children: [
                      Text(
                        'Low: ${snapshot.lowPrice.toStringAsFixed(2)} ${snapshot.currency}',
                      ),
                      Text(
                        'Avg: ${snapshot.averagePrice.toStringAsFixed(2)} ${snapshot.currency}',
                      ),
                      Text(
                        'High: ${snapshot.highPrice.toStringAsFixed(2)} ${snapshot.currency}',
                      ),
                    ],
                  ),
                  if ((snapshot.url ?? '').trim().isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(
                      snapshot.url!,
                      style: const TextStyle(color: Colors.white70),
                    ),
                  ],
                  const SizedBox(height: 8),
                  Text(
                    snapshot.capturedAt.toIso8601String().split('T').first,
                    style: const TextStyle(color: Colors.white70),
                  ),
                ],
              ),
            ),
          ),
        ),
        Positioned(
          top: 10,
          right: 10,
          child: InkWell(
            onTap: onToggleSelection,
            borderRadius: BorderRadius.circular(999),
            child: Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: selected
                    ? Colors.green.withValues(alpha: 0.18)
                    : Colors.white10,
                shape: BoxShape.circle,
                border: Border.all(
                  color: selected ? Colors.green : Colors.white30,
                ),
              ),
              child: Icon(
                selected ? Icons.check : Icons.add,
                size: 18,
                color: selected ? Colors.green : Colors.white70,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
