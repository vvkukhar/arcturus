import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_alert_model.dart';

class DashboardAlertCard extends StatelessWidget {
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
  Widget build(BuildContext context) {
    final color = _color();

    return Card(
      child: ListTile(
        leading: Icon(Icons.notifications_active_outlined, color: color),
        title: Text(alert.title),
        subtitle: Text(alert.subtitle),
      ),
    );
  }
}
