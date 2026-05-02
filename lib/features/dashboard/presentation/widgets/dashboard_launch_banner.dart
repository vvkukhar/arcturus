import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_launch_readiness_provider.dart';

class DashboardLaunchBanner extends StatelessWidget {
  final DashboardLaunchReadinessModel model;

  const DashboardLaunchBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.green.withValues(alpha: 0.15),
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
