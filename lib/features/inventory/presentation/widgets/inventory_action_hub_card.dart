import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_hub_entry_model.dart';

class InventoryActionHubCard extends StatelessWidget {
  final InventoryActionHubEntryModel entry;
  final VoidCallback onTap;

  const InventoryActionHubCard({
    super.key,
    required this.entry,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(entry.title),
        subtitle: Text(entry.subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}
