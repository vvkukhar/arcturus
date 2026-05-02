import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_provider.dart';

class ActionReportHelperService {
  final Ref ref;

  ActionReportHelperService(this.ref);

  Future<void> save({
    required String title,
    required String note,
  }) async {
    await ref.read(activityLogProvider).add(
          title: title,
          subtitle: note,
          type: 'report',
        );
  }
}

final actionReportHelperProvider = Provider<ActionReportHelperService>((ref) {
  return ActionReportHelperService(ref);
});