import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/rate_sync_log_model.dart';

class RateSyncLogCard extends StatelessWidget {
  final RateSyncLogModel log;

  const RateSyncLogCard({
    super.key,
    required this.log,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(log.success ? 'Success' : 'Failed'),
        subtitle: Text(log.note ?? '-'),
        trailing: Text(log.syncedAt.toIso8601String().split('T').first),
      ),
    );
  }
}