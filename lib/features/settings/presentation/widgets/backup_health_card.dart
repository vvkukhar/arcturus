import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/settings/application/backup_health_model.dart';

class BackupHealthCard extends StatelessWidget {
  final BackupHealthModel model;

  const BackupHealthCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final healthy = model.looksHealthy;

    return Card(
      child: ListTile(
        title: Text(healthy ? 'Backup Ready' : 'Backup Empty'),
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