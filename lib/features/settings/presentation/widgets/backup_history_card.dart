import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/settings/application/backup_history_entry_model.dart';

class BackupHistoryCard extends ConsumerWidget {
  final BackupHistoryEntryModel entry;

  const BackupHistoryCard({
    super.key,
    required this.entry,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        title: Text(entry.fileName),
        subtitle: Text(
          '${i18n.t(entry.type)} • ${entry.createdAt.toIso8601String().split('T').first}',
        ),
        trailing: Text(
          entry.recordCount.toString(),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}