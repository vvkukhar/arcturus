import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_scheduled_run_log_entry_model.dart';

class AnalyticsScheduledRunLogController
    extends StateNotifier<List<AnalyticsScheduledRunLogEntryModel>> {
  AnalyticsScheduledRunLogController() : super(const []);

  void add(AnalyticsScheduledRunLogEntryModel entry) {
    state = [entry, ...state].take(20).toList();
  }

  void clear() {
    state = const [];
  }
}

final analyticsScheduledRunLogProvider = StateNotifierProvider<
    AnalyticsScheduledRunLogController,
    List<AnalyticsScheduledRunLogEntryModel>>(
  (ref) => AnalyticsScheduledRunLogController(),
);
