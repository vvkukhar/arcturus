import 'package:flutter/material.dart';

class PriceRow extends StatelessWidget {
  final String label;
  final double value;

  const PriceRow({
    super.key,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label),
        Text(value.toStringAsFixed(2)),
      ],
    );
  }
}
