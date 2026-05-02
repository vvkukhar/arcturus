import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/sales/application/sale_link_status_model.dart';

class SaleLinkStatusBadge extends StatelessWidget {
  final SaleLinkStatusModel model;

  const SaleLinkStatusBadge({
    super.key,
    required this.model,
  });

  Color _color() {
    if (!model.hasLink) return Colors.redAccent;
    if (model.isManual) return Colors.green;
    return Colors.blueGrey;
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        model.label,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}