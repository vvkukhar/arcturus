import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';

class SalesUnmatchedListCard extends StatelessWidget {
  final List<SaleModel> sales;
  final void Function(SaleModel sale) onOpenSale;

  const SalesUnmatchedListCard({
    super.key,
    required this.sales,
    required this.onOpenSale,
  });

  @override
  Widget build(BuildContext context) {
    if (sales.isEmpty) {
      return const SizedBox.shrink();
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Unmatched Sales',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 10),
            ...sales.take(5).map(
                  (sale) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text(sale.platform),
                    subtitle: Text(
                      'Item ${sale.itemId} • qty ${sale.quantity} • net ${sale.finalNet.toStringAsFixed(2)}',
                    ),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => onOpenSale(sale),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}