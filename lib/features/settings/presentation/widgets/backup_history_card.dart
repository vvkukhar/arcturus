import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/settings/application/backup_history_entry_model.dart';

class BackupHistoryCard extends StatelessWidget {
  final BackupHistoryEntryModel entry;

  const BackupHistoryCard({
    super.key,
    required this.entry,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(entry.fileName),
        subtitle: Text(
          '${entry.type} • ${entry.createdAt.toIso8601String().split('T').first}',
        ),
        trailing: Text(
          entry.recordCount.toString(),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}