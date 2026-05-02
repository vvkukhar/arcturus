// lib/features/inventory/application/action_report_helper_service.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/manual_action_report_provider.dart';

class ActionReportHelperService {
  final Ref ref;

  ActionReportHelperService(this.ref);

  Future<void> save({
    required String title,
    required String note,
  }) async {
    await ref.read(manualActionReportProvider).add(
          title: title,
          note: note,
        );
  }
}
