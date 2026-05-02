import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchaseCostBreakdownCard extends StatelessWidget {
  final PurchaseModel purchase;

  const PurchaseCostBreakdownCard({
    super.key,
    required this.purchase,
  });

  Widget _row(String label, double value, String currency) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            CurrencyFormatter.format(value, currency: currency),
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
            _row('Purchase Price', purchase.purchasePrice, purchase.currency),
            _row('Shipping', purchase.shippingCost, purchase.currency),
            _row('Additional Costs', purchase.additionalCosts, purchase.currency),
            const Divider(),
            _row('Final Total', purchase.finalTotal, purchase.currency),
          ],
        ),
      ),
    );
  }
}