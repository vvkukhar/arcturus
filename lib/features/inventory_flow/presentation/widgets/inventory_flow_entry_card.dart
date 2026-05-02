import 'package:flutter/material.dart';

class InventoryFlowEntryCard extends StatelessWidget {
  final VoidCallback onOpen;

  const InventoryFlowEntryCard({
    super.key,
    required this.onOpen,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: const Icon(Icons.account_tree_outlined),
        title: const Text(
          'Inventory Flow',
          style: TextStyle(fontWeight: FontWeight.w900),
        ),
        subtitle: const Text(
          'Track purchased units, sold units, remaining stock and allocated profit.',
        ),
        trailing: const Icon(Icons.chevron_right),
        onTap: onOpen,
      ),
    );
  }
}