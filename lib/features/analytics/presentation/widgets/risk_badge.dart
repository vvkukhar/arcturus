import 'package:flutter/material.dart';

class RiskBadge extends StatelessWidget {
  final bool isRisk;

  const RiskBadge({super.key, required this.isRisk});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: isRisk
            ? Colors.red.withValues(alpha: 0.15)
            : Colors.green.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        isRisk ? 'RISK' : 'SAFE',
        style: TextStyle(
          color: isRisk ? Colors.red : Colors.green,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}
