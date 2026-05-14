import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
import 'package:lego_trading_manager/features/inventory/presentation/item_form_screen.dart';

class ItemDetailsScreen extends ConsumerWidget {
  final ItemModel item;
  const ItemDetailsScreen({super.key, required this.item});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final expectedProfit = (item.expectedSalePrice ?? 0) - item.totalCost;
    final margin = (item.expectedSalePrice ?? 0) <= 0 ? 0.0 : (expectedProfit / item.expectedSalePrice!) * 100;
    final roi = item.totalCost <= 0 ? 0.0 : (expectedProfit / item.totalCost) * 100;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Item Details', style: TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ItemFormScreen(item: item))),
          ),
        ],
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(20)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900), maxLines: 2, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8, runSpacing: 8,
                  children: [
                    _Badge(item.type.name.toUpperCase(), Colors.blue),
                    _Badge(item.status.name.toUpperCase(), Colors.orange),
                    if (item.theme != null) _Badge(item.theme!, Colors.purple),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text('Financial Insights', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12, mainAxisSpacing: 12,
            childAspectRatio: 1.5,
            children: [
              _InsightCard('Expected Profit', expectedProfit.toStringAsFixed(2), expectedProfit >= 0 ? Colors.green : Colors.red),
              _InsightCard('ROI', '${roi.toStringAsFixed(1)}%', roi >= 0 ? Colors.green : Colors.red),
              _InsightCard('Margin', '${margin.toStringAsFixed(1)}%', margin >= 0 ? Colors.green : Colors.red),
              _InsightCard('Days Held', (item.daysInInventory ?? 0).toString(), Colors.blueAccent),
            ],
          ),
          const SizedBox(height: 16),
          const Text('Core Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(16)),
            child: Column(
              children: [
                _InfoRow('Total Cost', item.totalCost.toStringAsFixed(2)),
                const Divider(height: 24, color: Colors.white10),
                _InfoRow('Market Avg', item.marketAverage?.toStringAsFixed(2) ?? '-'),
                const Divider(height: 24, color: Colors.white10),
                _InfoRow('Expected Sale', item.expectedSalePrice?.toStringAsFixed(2) ?? '-'),
                const Divider(height: 24, color: Colors.white10),
                _InfoRow('Condition', item.condition.name),
                const Divider(height: 24, color: Colors.white10),
                _InfoRow('Completeness', item.completeness.name),
              ],
            ),
          ),
          if (item.notes != null && item.notes!.isNotEmpty) ...[
            const SizedBox(height: 16),
            const Text('Notes', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(16)),
              child: Text(item.notes!),
            ),
          ]
        ],
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  final String text;
  final Color color;
  const _Badge(this.text, this.color);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(8)),
      child: Text(text, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12), maxLines: 1, overflow: TextOverflow.ellipsis),
    );
  }
}

class _InsightCard extends StatelessWidget {
  final String title;
  final String value;
  final Color color;
  const _InsightCard(this.title, this.value, this.color);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(16), border: Border.all(color: color.withValues(alpha: 0.2))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Flexible(child: Text(title, style: TextStyle(fontSize: 12, color: color, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis)),
          const SizedBox(height: 4),
          Flexible(child: Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900), maxLines: 1, overflow: TextOverflow.ellipsis)),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  const _InfoRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(child: Text(label, style: const TextStyle(color: Colors.white70), maxLines: 1, overflow: TextOverflow.ellipsis)),
        const SizedBox(width: 8),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
      ],
    );
  }
}