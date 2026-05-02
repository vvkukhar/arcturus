import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_landed_cost_model.dart';

class PurchaseLandedCostCard extends StatelessWidget {
  final PurchaseLandedCostModel model;
  final String currency;

  const PurchaseLandedCostCard({
    super.key,
    required this.model,
    required this.currency,
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
            _row(
              'Item price',
              '${model.purchasePrice.toStringAsFixed(2)} $currency',
            ),
            _row(
              'Shipping share',
              '${model.shippingSharePercent.toStringAsFixed(1)}%',
            ),
            _row(
              'Extra costs share',
              '${model.extraSharePercent.toStringAsFixed(1)}%',
            ),
            const Divider(),
            _row(
              'Landed cost',
              '${model.finalTotal.toStringAsFixed(2)} $currency',
            ),
          ],
        ),
      ),
    );
  }
}