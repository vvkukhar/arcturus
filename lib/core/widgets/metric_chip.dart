// lib/core/widgets/metric_chip.dart

import 'package:flutter/material.dart';

class MetricChip extends StatelessWidget {
  final String label;
  final String value;

  const MetricChip({
    super.key,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Chip(
      label: Text('$label: $value'),
    );
  }
}
