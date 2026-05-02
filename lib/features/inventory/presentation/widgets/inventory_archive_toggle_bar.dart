import 'package:flutter/material.dart';

class InventoryArchiveToggleBar extends StatelessWidget {
  final bool showArchived;
  final ValueChanged<bool> onChanged;

  const InventoryArchiveToggleBar({
    super.key,
    required this.showArchived,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: SwitchListTile(
        value: showArchived,
        onChanged: onChanged,
        title: const Text('Show archived items'),
        subtitle: const Text('Include archived inventory in visible list'),
      ),
    );
  }
}