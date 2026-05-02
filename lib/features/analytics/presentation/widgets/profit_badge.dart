import 'package:flutter/material.dart';

class ProfitBadge extends StatelessWidget {
  final double profit;

  const ProfitBadge({super.key, required this.profit});

  @override
  Widget build(BuildContext context) {
    final color = profit >= 0 ? Colors.green : Colors.red;

    return Text(
      profit.toStringAsFixed(2),
      style: TextStyle(
        color: color,
        fontWeight: FontWeight.bold,
      ),
    );
  }
}
