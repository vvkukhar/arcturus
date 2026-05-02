import 'package:flutter/material.dart';

class DashboardPriorityQueueItemActionBar extends StatelessWidget {
  final VoidCallback onDone;
  final VoidCallback onSkip;
  final VoidCallback onReset;

  const DashboardPriorityQueueItemActionBar({
    super.key,
    required this.onDone,
    required this.onSkip,
    required this.onReset,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        FilledButton.tonal(
          onPressed: onDone,
          child: const Text('Done'),
        ),
        FilledButton.tonal(
          onPressed: onSkip,
          child: const Text('Skip'),
        ),
        TextButton(
          onPressed: onReset,
          child: const Text('Reset'),
        ),
      ],
    );
  }
}
