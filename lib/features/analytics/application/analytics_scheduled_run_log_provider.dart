import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_scheduled_run_log_entry_model.dart';

class AnalyticsScheduledRunLogController extends Notifier<List<AnalyticsScheduledRunLogEntryModel>> {
  @override
  List<AnalyticsScheduledRunLogEntryModel> build() {
    return const [];
  }

  void add(AnalyticsScheduledRunLogEntryModel entry) {
    state = [entry, ...state].take(20).toList();
  }

  void clear() {
    state = const [];
  }
}

final analyticsScheduledRunLogProvider = NotifierProvider<
    AnalyticsScheduledRunLogController,
    List<AnalyticsScheduledRunLogEntryModel>>(
  AnalyticsScheduledRunLogController.new,
);