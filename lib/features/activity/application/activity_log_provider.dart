// lib/features/activity/application/activity_log_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_service.dart';

final activityLogProvider = Provider<ActivityLogService>((ref) {
  return ActivityLogService(ref);
});
