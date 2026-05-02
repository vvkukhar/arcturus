import 'package:flutter/material.dart';

class GlobalSearchCompactTopHitBar extends StatelessWidget {
  final bool value;
  final ValueChanged<bool> onChanged;

  const GlobalSearchCompactTopHitBar({
    super.key,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: SwitchListTile(
        value: value,
        onChanged: onChanged,
        title: const Text('Compact top-hit mode'),
        subtitle: const Text('Show strongest match as minimal focused result'),
      ),
    );
  }
}
