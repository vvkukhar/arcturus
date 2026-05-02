import 'package:flutter/material.dart';

class AnalyticsSelectionControlsBar extends StatelessWidget {
  final VoidCallback onSelectAll;
  final VoidCallback onClear;

  const AnalyticsSelectionControlsBar({
    super.key,
    required this.onSelectAll,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        TextButton(
          onPressed: onSelectAll,
          child: const Text('Select All'),
        ),
        const SizedBox(width: 8),
        TextButton(
          onPressed: onClear,
          child: const Text('Clear'),
        ),
      ],
    );
  }
}
