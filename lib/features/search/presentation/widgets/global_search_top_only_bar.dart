import 'package:flutter/material.dart';

class GlobalSearchTopOnlyBar extends StatelessWidget {
  final bool value;
  final ValueChanged<bool> onChanged;

  const GlobalSearchTopOnlyBar({
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
        title: const Text('Top results only'),
        subtitle: const Text('Show only strongest matches first'),
      ),
    );
  }
}