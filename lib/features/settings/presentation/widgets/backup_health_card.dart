import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/settings/application/backup_health_model.dart';

class BackupHealthCard extends ConsumerWidget {
  final BackupHealthModel model;

  const BackupHealthCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final healthy = model.looksHealthy;
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        title: Text(healthy ? i18n.t('Backup Ready') : i18n.t('Backup Empty')),
        subtitle: Text(
          'inventory=${model.hasInventory}, sales=${model.hasSales}, purchases=${model.hasPurchases}',
        ),
        trailing: Icon(
          healthy ? Icons.verified_outlined : Icons.warning_amber_outlined,
          color: healthy ? Colors.green : Colors.orange,
        ),
      ),
    );
  }
}