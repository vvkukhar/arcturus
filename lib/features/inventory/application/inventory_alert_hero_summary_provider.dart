import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_hero_summary_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_overview_provider.dart';

final inventoryAlertHeroSummaryProvider =
    Provider<InventoryAlertHeroSummaryModel>((ref) {
  final overview = ref.watch(inventoryAlertOverviewProvider);

  if (overview.totalAlerts == 0) {
    return const InventoryAlertHeroSummaryModel(
      title: 'Inventory looks stable',
      subtitle: 'No active alert pressure right now.',
      severe: 0,
      total: 0,
    );
  }

  if (overview.severeAlerts >= 5) {
    return InventoryAlertHeroSummaryModel(
      title: 'Inventory alert pressure is high',
      subtitle:
          'Severe alerts ${overview.severeAlerts} of total ${overview.totalAlerts}.',
      severe: overview.severeAlerts,
      total: overview.totalAlerts,
    );
  }

  return InventoryAlertHeroSummaryModel(
    title: 'Inventory needs review',
    subtitle:
        'Alerts ${overview.totalAlerts} • severe ${overview.severeAlerts}.',
    severe: overview.severeAlerts,
    total: overview.totalAlerts,
  );
});