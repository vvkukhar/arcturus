import 'package:flutter/material.dart';

class InventoryFilterButton extends StatelessWidget {
  final VoidCallback onTap;

  const InventoryFilterButton({
    super.key,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return FilledButton.tonalIcon(
      onPressed: onTap,
      icon: const Icon(Icons.tune),
      label: const Text('Filters'),
    );
  }
}
