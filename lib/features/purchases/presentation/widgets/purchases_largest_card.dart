import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchasesLargestCard extends StatelessWidget {
  final List<PurchaseModel> items;
  final void Function(PurchaseModel item)? onOpen;

  const PurchasesLargestCard({
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
              'Largest Purchases',
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
                subtitle: Text((item.note ?? '').isEmpty ? item.itemId : item.note!),
                trailing: Text(
                  '${item.finalTotal.toStringAsFixed(2)} ${item.currency}',
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