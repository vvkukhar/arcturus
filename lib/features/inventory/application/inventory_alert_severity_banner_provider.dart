import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_overview_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_severity_banner_model.dart';

final inventoryAlertSeverityBannerProvider =
    Provider<InventoryAlertSeverityBannerModel>((ref) {
  final overview = ref.watch(inventoryAlertOverviewProvider);
  final label = overview.severeAlerts == 0
      ? 'No severe inventory alerts'
      : overview.severeAlerts <= 3
          ? 'Manage severe alerts soon'
          : 'High alert pressure in inventory';
  return InventoryAlertSeverityBannerModel(
    label: label,
    severeCount: overview.severeAlerts,
  );
});
