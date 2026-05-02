// lib/features/activity/application/activity_log_helper_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_service.dart';

final activityLogHelperProvider = Provider<ActivityLogHelperService>((ref) {
  return ActivityLogHelperService(ref);
});
