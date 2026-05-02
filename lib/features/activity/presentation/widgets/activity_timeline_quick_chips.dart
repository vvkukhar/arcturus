import 'package:flutter/material.dart';

class ActivityTimelineQuickChips extends StatelessWidget {
  final String? value;
  final ValueChanged<String?> onChanged;
  final VoidCallback onClear;

  const ActivityTimelineQuickChips({
    super.key,
    required this.value,
    required this.onChanged,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    const values = <String?>[null, 'report', 'purchase', 'sale', 'watchlist'];

    String label(String? v) {
      switch (v) {
        case null:
          return 'All';
        case 'report':
          return 'Reports';
        case 'purchase':
          return 'Purchases';
        case 'sale':
          return 'Sales';
        case 'watchlist':
          return 'Watchlist';
        default:
          return v;
      }
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            ...values.map(
              (v) => ChoiceChip(
                label: Text(label(v)),
                selected: value == v,
                onSelected: (_) => onChanged(v),
              ),
            ),
            TextButton(
              onPressed: onClear,
              child: const Text('Clear'),
            ),
          ],
        ),
      ),
    );
  }
}
