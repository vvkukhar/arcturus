import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_action_model.dart';

class DeadStockActionCard extends StatelessWidget {
  final DeadStockActionModel model;
  final VoidCallback onTap;

  const DeadStockActionCard({
    super.key,
    required this.model,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(model.title),
        subtitle: Text(model.subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}
