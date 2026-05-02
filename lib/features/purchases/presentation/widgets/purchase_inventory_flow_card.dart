import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchaseInventoryFlowCard extends StatelessWidget {
  final PurchaseModel purchase;

  const PurchaseInventoryFlowCard({
    super.key,
    required this.purchase,
  });

  Widget _row(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w900),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final remainingValue = purchase.unitCost * purchase.remainingQuantity;
    final soldValue = purchase.unitCost * purchase.soldQuantity;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _row('Quantity', purchase.quantity.toString()),
            _row('Sold', purchase.soldQuantity.toString()),
            _row('Remaining', purchase.remainingQuantity.toString()),
            const Divider(),
            _row(
              'Unit Cost',
              CurrencyFormatter.format(
                purchase.unitCost,
                currency: purchase.currency,
              ),
            ),
            _row(
              'Remaining Cost Value',
              CurrencyFormatter.format(
                remainingValue,
                currency: purchase.currency,
              ),
            ),
            _row(
              'Sold Cost Value',
              CurrencyFormatter.format(
                soldValue,
                currency: purchase.currency,
              ),
            ),
          ],
        ),
      ),
    );
  }
}