// lib/features/analytics/presentation/widgets/smart_recommendation_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/smart_recommendation_model.dart';

class SmartRecommendationCard extends StatelessWidget {
  final SmartRecommendationModel model;

  const SmartRecommendationCard({
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
        leading: Icon(Icons.tips_and_updates_outlined, color: color),
        title: Text(model.title),
        subtitle: Text(model.message),
      ),
    );
  }
}
