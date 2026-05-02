// lib/features/activity/application/activity_log_helper_service.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_provider.dart';

class ActivityLogHelperService {
  final Ref ref;

  ActivityLogHelperService(this.ref);

  Future<void> reportSaved({
    required String area,
    required String title,
  }) async {
    await ref.read(activityLogProvider).add(
          title: 'Report saved',
          subtitle: '$area | $title',
          type: 'report',
        );
  }

  Future<void> inventoryAction({
    required String title,
    required String subtitle,
  }) async {
    await ref.read(activityLogProvider).add(
          title: title,
          subtitle: subtitle,
          type: 'inventory',
        );
  }

  Future<void> marketAction({
    required String title,
    required String subtitle,
  }) async {
    await ref.read(activityLogProvider).add(
          title: title,
          subtitle: subtitle,
          type: 'market',
        );
  }
}
