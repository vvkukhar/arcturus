import 'package:flutter/material.dart';

class DashboardOperatorShortcutsCard extends StatelessWidget {
  final VoidCallback onOpenUnresolved;
  final VoidCallback onOpenSourceRuns;
  final VoidCallback onOpenSourceHealth;
  final VoidCallback onOpenSyncErrors;

  const DashboardOperatorShortcutsCard({
    super.key,
    required this.onOpenUnresolved,
    required this.onOpenSourceRuns,
    required this.onOpenSourceHealth,
    required this.onOpenSyncErrors,
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
              onPressed: onOpenUnresolved,
              child: const Text('Unresolved Matches'),
            ),
            FilledButton.tonal(
              onPressed: onOpenSourceRuns,
              child: const Text('Source Runs'),
            ),
            FilledButton.tonal(
              onPressed: onOpenSourceHealth,
              child: const Text('Source Health'),
            ),
            FilledButton.tonal(
              onPressed: onOpenSyncErrors,
              child: const Text('Sync Errors'),
            ),
          ],
        ),
      ),
    );
  }
}
