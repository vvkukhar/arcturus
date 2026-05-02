import 'package:flutter/material.dart';

class ItemStatusActionCard extends StatelessWidget {
  final VoidCallback? onPrevious;
  final VoidCallback? onNext;

  const ItemStatusActionCard({
    super.key,
    required this.onPrevious,
    required this.onNext,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: onPrevious,
                icon: const Icon(Icons.arrow_back),
                label: const Text('Previous Status'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: FilledButton.icon(
                onPressed: onNext,
                icon: const Icon(Icons.arrow_forward),
                label: const Text('Next Status'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}