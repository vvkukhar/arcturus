import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_balance_insight_model.dart';
import 'package:lego_trading_manager/features/activity/application/activity_balance_summary_provider.dart';

final activityBalanceInsightProvider =
    Provider<ActivityBalanceInsightModel>((ref) {
  final summary = ref.watch(activityBalanceSummaryProvider);

  if (summary.purchases > summary.reports &&
      summary.purchases > summary.sales) {
    return const ActivityBalanceInsightModel(
      label: 'Purchase-heavy activity',
    );
  }
  if (summary.reports > summary.purchases && summary.reports > summary.sales) {
    return const ActivityBalanceInsightModel(
      label: 'Report-heavy activity',
    );
  }
  if (summary.sales > summary.purchases && summary.sales > summary.reports) {
    return const ActivityBalanceInsightModel(
      label: 'Sales-heavy activity',
    );
  }

  return const ActivityBalanceInsightModel(
    label: 'Balanced activity mix',
  );
});
