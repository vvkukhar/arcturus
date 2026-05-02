// lib/features/activity/presentation/widgets/activity_log_card.dart
import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_entry_model.dart';

class ActivityLogCard extends StatelessWidget {
  final ActivityLogEntryModel entry;

  const ActivityLogCard({
    super.key,
    required this.entry,
  });

  IconData _icon() {
    switch (entry.type) {
      case 'report':
        return Icons.note_alt_outlined;
      case 'market':
        return Icons.query_stats_outlined;
      case 'purchase':
        return Icons.shopping_cart_checkout_outlined;
      case 'watchlist':
        return Icons.bookmark_outline;
      default:
        return Icons.bolt_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final date = entry.createdAt.toIso8601String().split('T').first;
    return Card(
      child: ListTile(
        leading: Icon(_icon()),
        title: Text(entry.title),
        subtitle: Text(entry.subtitle),
        trailing: Text(
          date,
          style: const TextStyle(color: Colors.white70),
        ),
      ),
    );
  }
}
