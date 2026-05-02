import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_discipline_model.dart';

class ActivityDisciplineBanner extends StatelessWidget {
  final ActivityDisciplineModel model;

  const ActivityDisciplineBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.lime.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        model.label,
        style: const TextStyle(
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
