import 'package:flutter/material.dart';

class ReviewReasonPresetsBar extends StatelessWidget {
  final ValueChanged<String> onSelect;

  const ReviewReasonPresetsBar({
    super.key,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    final presets = [
      'Weak margin',
      'Need photo check',
      'Need set verification',
      'Need price validation',
      'Need condition check',
    ];

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: presets
          .map(
            (preset) => ActionChip(
              label: Text(preset),
              onPressed: () => onSelect(preset),
            ),
          )
          .toList(),
    );
  }
}
