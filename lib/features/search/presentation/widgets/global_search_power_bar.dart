import 'package:flutter/material.dart';

class GlobalSearchPowerBar extends StatelessWidget {
  final bool powerMode;
  final ValueChanged<bool> onChanged;
  final VoidCallback onFocusSearch;
  final VoidCallback onClearAll;

  const GlobalSearchPowerBar({
    super.key,
    required this.powerMode,
    required this.onChanged,
    required this.onFocusSearch,
    required this.onClearAll,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            FilterChip(
              label: const Text('Power mode'),
              selected: powerMode,
              onSelected: onChanged,
            ),
            TextButton(
              onPressed: onFocusSearch,
              child: const Text('Focus search'),
            ),
            TextButton(
              onPressed: onClearAll,
              child: const Text('Clear state'),
            ),
          ],
        ),
      ),
    );
  }
}
