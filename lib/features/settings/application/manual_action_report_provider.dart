import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/manual_action_report_service.dart';

final manualActionReportProvider = Provider<ManualActionReportService>((ref) {
  return ManualActionReportService(ref);
});