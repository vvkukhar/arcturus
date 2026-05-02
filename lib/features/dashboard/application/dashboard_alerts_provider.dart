import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_alert_model.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_providers.dart';

final dashboardAlertsProvider = Provider<List<DashboardAlertModel>>((ref) {
  final stale = ref.watch(dashboardStaleInventoryProvider);
  final bestDeals = ref.watch(dashboardBestDealsProvider);

  final alerts = <DashboardAlertModel>[];

  if (stale.isNotEmpty) {
    alerts.add(
      DashboardAlertModel(
        title: 'Dead stock detected',
        subtitle: '${stale.length} item(s) are sitting too long',
        severity: 'warning',
      ),
    );
  }

  if (bestDeals.isNotEmpty) {
    alerts.add(
      const DashboardAlertModel(
        title: 'Strong opportunities in inventory',
        subtitle: 'Check best expected-profit items',
        severity: 'info',
      ),
    );
  }

  if (alerts.isEmpty) {
    alerts.add(
      const DashboardAlertModel(
        title: 'System stable',
        subtitle: 'No major dashboard alerts right now',
        severity: 'success',
      ),
    );
  }

  return alerts;
});
