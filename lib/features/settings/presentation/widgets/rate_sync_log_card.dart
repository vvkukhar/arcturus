import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/data/models/rate_sync_log_model.dart';

class RateSyncLogCard extends ConsumerWidget {
  final RateSyncLogModel log;

  const RateSyncLogCard({
    super.key,
    required this.log,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        title: Text(log.success ? i18n.t('Success') : i18n.t('Failed')),
        subtitle: Text(log.note ?? '-'),
        trailing: Text(log.syncedAt.toIso8601String().split('T').first),
      ),
    );
  }
}