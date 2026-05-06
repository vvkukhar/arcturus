import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_entry_model.dart';

class ActivityTimelineCompactTile extends ConsumerWidget {
  final ActivityLogEntryModel entry;

  const ActivityTimelineCompactTile({
    super.key,
    required this.entry,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return ListTile(
      dense: true,
      contentPadding: EdgeInsets.zero,
      title: Text(i18n.t(entry.title)),
      subtitle: Text(i18n.t(entry.subtitle)),
      trailing: Text(
        entry.createdAt.toIso8601String().split('T').first,
        style: const TextStyle(color: Colors.white70, fontSize: 12),
      ),
    );
  }
}