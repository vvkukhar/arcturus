import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_entry_model.dart';

class ActivityTimelineCard extends StatelessWidget {
  final ActivityLogEntryModel entry;

  const ActivityTimelineCard({
    super.key,
    required this.entry,
  });

  IconData _icon() {
    switch (entry.type) {
      case 'report':
        return Icons.note_alt_outlined;
      case 'purchase':
        return Icons.shopping_cart_checkout_outlined;
      case 'sale':
        return Icons.sell_outlined;
      case 'watchlist':
        return Icons.bookmark_outline;
      case 'market':
        return Icons.query_stats_outlined;
      case 'inventory':
        return Icons.inventory_2_outlined;
      default:
        return Icons.bolt_outlined;
    }
  }

  Color _color() {
    switch (entry.type) {
      case 'report':
        return Colors.orange;
      case 'purchase':
        return Colors.green;
      case 'sale':
        return Colors.purple;
      case 'watchlist':
        return Colors.blue;
      case 'market':
        return Colors.cyan;
      case 'inventory':
        return Colors.teal;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();
    final date = entry.createdAt.toIso8601String().split('T').first;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: color.withValues(alpha: 0.16),
              child: Icon(_icon(), color: color, size: 18),
            ),
            Container(
              width: 2,
              height: 56,
              color: Colors.white12,
            ),
          ],
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    entry.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(entry.subtitle),
                  const SizedBox(height: 8),
                  Text(
                    '$date • ${entry.type}',
                    style: const TextStyle(color: Colors.white70),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
