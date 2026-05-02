import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';

class SalePurchaseLinkPickerScreen extends ConsumerWidget {
  final SaleModel sale;

  const SalePurchaseLinkPickerScreen({
    super.key,
    required this.sale,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final purchases = ref.watch(purchasesControllerProvider);

    final sameItem = purchases.where((purchase) {
      return purchase.itemId == sale.itemId;
    }).toList();

    final other = purchases.where((purchase) {
      return purchase.itemId != sale.itemId;
    }).toList();

    Widget purchaseTile(PurchaseModel purchase) {
      return Card(
        child: ListTile(
          title: Text(purchase.source),
          subtitle: Text(
            'Item ${purchase.itemId} • ${purchase.purchaseDate.toIso8601String().split('T').first}',
          ),
          trailing: Text(
            CurrencyFormatter.format(
              purchase.finalTotal,
              currency: purchase.currency,
            ),
            style: const TextStyle(fontWeight: FontWeight.w800),
          ),
          onTap: () => Navigator.of(context).pop(purchase),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Link Purchase'),
      ),
      body: purchases.isEmpty
          ? const Center(
              child: Text('No purchases available to link.'),
            )
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Text(
                      'Sale item: ${sale.itemId}',
                      style: const TextStyle(
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ),
                if (sameItem.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  const Text(
                    'Recommended matches',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 10),
                  ...sameItem.map(purchaseTile),
                ],
                if (other.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  const Text(
                    'Other purchases',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 10),
                  ...other.map(purchaseTile),
                ],
              ],
            ),
    );
  }
}