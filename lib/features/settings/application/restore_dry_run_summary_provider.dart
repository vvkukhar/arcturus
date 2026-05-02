import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/restore_dry_run_summary_service.dart';

final restoreDryRunSummaryProvider =
    Provider<RestoreDryRunSummaryService>((ref) {
  return RestoreDryRunSummaryService();
});