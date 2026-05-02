import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_momentum_model.dart';

class ActivityMomentumBanner extends StatelessWidget {
  final ActivityMomentumModel model;

  const ActivityMomentumBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.teal.withValues(alpha: 0.12),
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
