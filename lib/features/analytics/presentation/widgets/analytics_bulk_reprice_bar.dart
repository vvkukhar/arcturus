import 'package:flutter/material.dart';

class AnalyticsBulkRepriceBar extends StatelessWidget {
  final VoidCallback onApply98;

  const AnalyticsBulkRepriceBar({
    super.key,
    required this.onApply98,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            FilledButton.icon(
              onPressed: onApply98,
              icon: const Icon(Icons.auto_fix_high_outlined),
              label: const Text('Apply 98% Market To All'),
            ),
          ],
        ),
      ),
    );
  }
}
