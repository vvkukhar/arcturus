import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_engine.dart';
import 'package:lego_trading_manager/features/inventory/presentation/item_form_screen.dart';

class InventoryActionCenterScreen extends ConsumerWidget {
  const InventoryActionCenterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(inventoryEngineProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Action Center', style: TextStyle(fontWeight: FontWeight.w900))),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (state) {
          return ListView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            children: [
              _buildHealthHero(state),
              const SizedBox(height: 24),
              if (state.analysis.deadStock.isNotEmpty) ...[
                const Text('Dead Stock ( > 30 days)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.redAccent)),
                const SizedBox(height: 12),
                ...state.analysis.deadStock.map((item) => _buildActionCard(context, item, 'Held for ${item.daysInInventory} days', Colors.redAccent)),
                const SizedBox(height: 24),
              ],
              if (state.analysis.alerts.isNotEmpty) ...[
                const Text('Review Required', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.orange)),
                const SizedBox(height: 12),
                ...state.analysis.alerts.map((item) => _buildActionCard(context, item, 'Low profit or market mismatch', Colors.orange)),
              ]
            ],
          );
        },
      ),
    );
  }

  Widget _buildHealthHero(InventoryEngineState state) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.orange.withValues(alpha: 0.15), Colors.redAccent.withValues(alpha: 0.15)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('${state.analysis.deadStockCount} Dead Stock Items', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900)),
          const SizedBox(height: 8),
          Text('${state.analysis.alertsCount} items require manual review.', style: const TextStyle(fontSize: 14, color: Colors.white70)),
        ],
      ),
    );
  }

  Widget _buildActionCard(BuildContext context, dynamic item, String reason, Color color) {
    return Card(
      color: const Color(0xFF171A21),
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: color.withValues(alpha: 0.3))),
      child: ListTile(
        leading: Icon(Icons.warning_amber_rounded, color: color),
        title: Text(item.title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(reason),
        trailing: const Icon(Icons.chevron_right),
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ItemFormScreen(item: item))),
      ),
    );
  }
}