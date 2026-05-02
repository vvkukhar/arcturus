import 'package:flutter/material.dart';

class AnalyticsSelectedRepriceBar extends StatelessWidget {
  final int selectedCount;
  final VoidCallback onApplySelected;
  final VoidCallback onClear;

  const AnalyticsSelectedRepriceBar({
    super.key,
    required this.selectedCount,
    required this.onApplySelected,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    if (selectedCount == 0) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                'Selected repricing items: $selectedCount',
                style: const TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
            TextButton(
              onPressed: onClear,
              child: const Text('Clear'),
            ),
            const SizedBox(width: 8),
            FilledButton(
              onPressed: onApplySelected,
              child: const Text('Apply Selected'),
            ),
          ],
        ),
      ),
    );
  }
}