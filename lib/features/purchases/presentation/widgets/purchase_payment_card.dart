import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchasePaymentCard extends StatelessWidget {
  final PurchaseModel purchase;

  const PurchasePaymentCard({
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
            _row('Currency', purchase.currency),
            _row('Exchange Rate', purchase.exchangeRate.toStringAsFixed(4)),
            _row('Payment Method', purchase.paymentMethod.name),
          ],
        ),
      ),
    );
  }
}