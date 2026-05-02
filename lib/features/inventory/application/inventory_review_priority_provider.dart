import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_overview_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_danger_summary_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_priority_model.dart';

final inventoryReviewPriorityProvider =
    Provider<InventoryReviewPriorityModel>((ref) {
  final alertOverview = ref.watch(inventoryAlertOverviewProvider);
  final danger = ref.watch(inventoryDangerSummaryProvider);
  final highRiskItems = danger.highRiskCount + danger.bothCount;
  final label = alertOverview.severeAlerts >= 5 || highRiskItems >= 5
      ? 'Immediate review priority'
      : alertOverview.severeAlerts >= 2 || highRiskItems >= 2
          ? 'Review priority is elevated'
          : 'Review priority is controlled';

  return InventoryReviewPriorityModel(
    label: label,
    severeAlerts: alertOverview.severeAlerts,
    highRiskItems: highRiskItems,
  );
});
