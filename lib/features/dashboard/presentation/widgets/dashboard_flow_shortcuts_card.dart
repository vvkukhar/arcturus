import 'package:flutter/material.dart';

class DashboardFlowShortcutsCard extends StatelessWidget {
  final VoidCallback onOpenPurchase;
  final VoidCallback onOpenReprice;
  final VoidCallback onOpenReview;

  const DashboardFlowShortcutsCard({
    super.key,
    required this.onOpenPurchase,
    required this.onOpenReprice,
    required this.onOpenReview,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            FilledButton.tonal(
              onPressed: onOpenPurchase,
              child: const Text('Purchase Flow'),
            ),
            FilledButton.tonal(
              onPressed: onOpenReprice,
              child: const Text('Reprice Flow'),
            ),
            FilledButton.tonal(
              onPressed: onOpenReview,
              child: const Text('Review Flow'),
            ),
          ],
        ),
      ),
    );
  }
}