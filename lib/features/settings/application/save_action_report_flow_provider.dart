import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/save_action_report_flow_service.dart';

final saveActionReportFlowProvider =
    Provider<SaveActionReportFlowService>((ref) {
  return SaveActionReportFlowService(ref);
});