import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_kpi_v2_model.dart';

class DashboardKpiV2Card extends StatelessWidget {
  final DashboardKpiV2Model model;

  const DashboardKpiV2Card({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(model.title),
            const SizedBox(height: 8),
            Text(
              model.value,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              model.subtitle,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}