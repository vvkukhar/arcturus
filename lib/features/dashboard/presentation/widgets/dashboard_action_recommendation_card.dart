import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_action_recommendation_model.dart';

class DashboardActionRecommendationCard extends StatelessWidget {
  final DashboardActionRecommendationModel model;

  const DashboardActionRecommendationCard({
    super.key,
    required this.model,
  });

  Color _color() {
    switch (model.severity) {
      case 'good':
        return Colors.green;
      case 'warning':
        return Colors.orange;
      case 'danger':
        return Colors.red;
      default:
        return Colors.blueGrey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();

    return Card(
      child: ListTile(
        leading: Icon(Icons.bolt, color: color),
        title: Text(model.title),
        subtitle: Text(model.subtitle),
      ),
    );
  }
}