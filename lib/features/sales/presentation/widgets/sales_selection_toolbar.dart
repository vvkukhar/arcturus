import 'package:flutter/material.dart';

class SalesSelectionToolbar extends StatelessWidget {
  final int visibleCount;
  final int selectedCount;
  final VoidCallback onSelectAll;
  final VoidCallback onClear;

  const SalesSelectionToolbar({
    super.key,
    required this.visibleCount,
    required this.selectedCount,
    required this.onSelectAll,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    if (visibleCount == 0) return const SizedBox.shrink();

    return Row(
      children: [
        Text(
          'Selected: $selectedCount',
          style: const TextStyle(
            color: Colors.white70,
            fontWeight: FontWeight.w700,
          ),
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