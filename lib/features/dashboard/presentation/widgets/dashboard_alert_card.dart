import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_alert_model.dart';

class DashboardAlertCard extends ConsumerWidget {
  final DashboardAlertModel alert;

  const DashboardAlertCard({
    super.key,
    required this.alert,
  });

  Color _color() {
    switch (alert.severity) {
      case 'warning':
        return Colors.orange;
      case 'success':
        return Colors.green;
      default:
        return Colors.blue;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final color = _color();
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        leading: Icon(Icons.notifications_active_outlined, color: color),
        title: Text(i18n.t(alert.title)),
        subtitle: Text(i18n.t(alert.subtitle)),
      ),
    );
  }
}