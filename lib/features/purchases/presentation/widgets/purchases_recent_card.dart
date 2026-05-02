import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchasesRecentCard extends StatelessWidget {
  final List<PurchaseModel> items;
  final void Function(PurchaseModel item)? onOpen;

  const PurchasesRecentCard({
    super.key,
    required this.items,
    this.onOpen,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return const SizedBox.shrink();
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Recent Purchases',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            ...items.map(
              (item) => ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(item.source),
                subtitle: Text(
                  '${item.currency} • ${item.purchaseDate.toIso8601String().split('T').first}',
                ),
                trailing: Text(
                  item.finalTotal.toStringAsFixed(2),
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
                onTap: onOpen == null ? null : () => onOpen!(item),
              ),
            ),
          ],
        ),
      ),
    );
  }
}