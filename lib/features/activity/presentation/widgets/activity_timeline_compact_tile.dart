import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_entry_model.dart';

class ActivityTimelineCompactTile extends StatelessWidget {
  final ActivityLogEntryModel entry;

  const ActivityTimelineCompactTile({
    super.key,
    required this.entry,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      dense: true,
      contentPadding: EdgeInsets.zero,
      title: Text(entry.title),
      subtitle: Text(entry.subtitle),
      trailing: Text(
        entry.createdAt.toIso8601String().split('T').first,
        style: const TextStyle(color: Colors.white70, fontSize: 12),
      ),
    );
  }
}
