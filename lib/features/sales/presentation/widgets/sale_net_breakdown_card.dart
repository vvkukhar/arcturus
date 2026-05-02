import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/sales/application/sale_net_breakdown_model.dart';

class SaleNetBreakdownCard extends StatelessWidget {
  final SaleNetBreakdownModel model;
  final String currency;

  const SaleNetBreakdownCard({
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
            _row('Gross', '${model.salePrice.toStringAsFixed(2)} $currency'),
            _row('Quantity', model.quantity.toString()),
            _row('Unit net', '${model.unitNet.toStringAsFixed(2)} $currency'),
            const Divider(),
            _row('Fee pressure', '${model.feeSharePercent.toStringAsFixed(1)}%'),
            _row(
              'Shipping pressure',
              '${model.shippingSharePercent.toStringAsFixed(1)}%',
            ),
            _row('Net share', '${model.netSharePercent.toStringAsFixed(1)}%'),
            const Divider(),
            _row('Final net', '${model.finalNet.toStringAsFixed(2)} $currency'),
          ],
        ),
      ),
    );
  }
}