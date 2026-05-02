import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_severity_banner_model.dart';

class InventoryAlertSeverityBanner extends StatelessWidget {
  final InventoryAlertSeverityBannerModel model;

  const InventoryAlertSeverityBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final color = model.severeCount == 0 ? Colors.green : Colors.redAccent;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        '${model.label} • ${model.severeCount}',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}