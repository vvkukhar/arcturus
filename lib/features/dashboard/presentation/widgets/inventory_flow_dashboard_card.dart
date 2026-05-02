import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/inventory_flow_screen.dart';

class InventoryFlowDashboardCard extends StatelessWidget {
  const InventoryFlowDashboardCard({super.key});

  void _open(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => const InventoryFlowScreen(),
      ),
    );
  }

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
          'Open stock, allocated sales, remaining value and ROI.',
        ),
        trailing: const Icon(Icons.chevron_right),
        onTap: () => _open(context),
      ),
    );
  }
}