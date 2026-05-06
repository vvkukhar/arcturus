import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_entry_model.dart';

class HomeLatestActivityCard extends StatelessWidget {
  final ActivityLogEntryModel entry;

  const HomeLatestActivityCard({
    super.key,
    required this.entry,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(entry.title),
        subtitle: Text(entry.subtitle),
        trailing: Text(
          entry.createdAt.toIso8601String().split('T').first,
          style: const TextStyle(color: Colors.white70),
        ),
      ),
    );
  }
}