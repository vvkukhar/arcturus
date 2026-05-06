import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_hub_entry_model.dart';

class InventoryActionHubCard extends ConsumerWidget {
  final InventoryActionHubEntryModel entry;
  final VoidCallback onTap;

  const InventoryActionHubCard({
    super.key,
    required this.entry,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: ListTile(
        title: Text(i18n.t(entry.title)),
        subtitle: Text(i18n.t(entry.subtitle)),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}