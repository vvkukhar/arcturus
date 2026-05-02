import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchaseTotalBreakdownCard extends StatelessWidget {
  final PurchaseModel purchase;

  const PurchaseTotalBreakdownCard({
    super.key,
    required this.purchase,
  });

  Widget _row(String label, double value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            CurrencyFormatter.format(
              value,
              currency: purchase.currency,
            ),
            style: const TextStyle(fontWeight: FontWeight.w800),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _row('Purchase price', purchase.purchasePrice),
            _row('Shipping cost', purchase.shippingCost),
            _row('Additional costs', purchase.additionalCosts),
            const Divider(),
            _row('Final total', purchase.finalTotal),
          ],
        ),
      ),
    );
  }
}