import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/inventory_flow_screen.dart';

class InventoryFlowDashboardCard extends ConsumerWidget {
  const InventoryFlowDashboardCard({super.key});

  void _open(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => const InventoryFlowScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: ListTile(
        leading: const Icon(Icons.account_tree_outlined),
        title: Text(
          i18n.t('drawer.inventoryFlow'),
          style: const TextStyle(fontWeight: FontWeight.w900),
        ),
        subtitle: Text(
          i18n.t('drawer.inventoryFlowSub'),
        ),
        trailing: const Icon(Icons.chevron_right),
        onTap: () => _open(context),
      ),
    );
  }
}