// lib/features/activity/application/latest_activity_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_entry_model.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_provider.dart';

final latestActivityProvider =
    FutureProvider<List<ActivityLogEntryModel>>((ref) async {
  final items = await ref.read(activityLogProvider).getAll();
  return items.take(8).toList();
});
