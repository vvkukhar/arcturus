import 'package:flutter/material.dart';

class WatchlistQueueSelectAllBar extends StatelessWidget {
  final int total;
  final VoidCallback onSelectAll;
  final VoidCallback onClear;

  const WatchlistQueueSelectAllBar({
    super.key,
    required this.total,
    required this.onSelectAll,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    if (total == 0) return const SizedBox.shrink();

    return Row(
      children: [
        Text(
          'Queue items: $total',
          style: const TextStyle(fontWeight: FontWeight.w700),
        ),
        const Spacer(),
        TextButton(
          onPressed: onSelectAll,
          child: const Text('Select all'),
        ),
        TextButton(
          onPressed: onClear,
          child: const Text('Clear'),
        ),
      ],
    );
  }
}