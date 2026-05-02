import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/sales/application/sale_profit_model.dart';

class SaleProfitCard extends StatelessWidget {
  final SaleProfitModel model;
  final String currency;

  const SaleProfitCard({
    super.key,
    required this.model,
    required this.currency,
  });

  Color _color() {
    if (!model.hasPurchaseCost) return Colors.grey;
    if (model.profit > 0) return Colors.green;
    if (model.profit == 0) return Colors.orange;
    return Colors.redAccent;
  }

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
    final color = _color();

    if (!model.hasPurchaseCost) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: const [
              Icon(Icons.link_off_outlined),
              SizedBox(width: 12),
              Expanded(
                child: Text(
                  'No stock allocation or purchase link found. Profit cannot be calculated yet.',
                  style: TextStyle(fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'Profit Result',
                    style: TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: 16,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    model.profit > 0 ? 'profit' : 'loss',
                    style: TextStyle(
                      color: color,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            _row('Quantity', model.quantity.toString()),
            _row('Sale net', '${model.saleNet.toStringAsFixed(2)} $currency'),
            _row('Purchase cost', '${model.purchaseCost.toStringAsFixed(2)} $currency'),
            const Divider(),
            _row('Unit net', '${model.unitNet.toStringAsFixed(2)} $currency'),
            _row('Unit cost', '${model.unitCost.toStringAsFixed(2)} $currency'),
            _row('Unit profit', '${model.unitProfit.toStringAsFixed(2)} $currency'),
            const Divider(),
            _row('Profit', '${model.profit.toStringAsFixed(2)} $currency'),
            _row('ROI', '${model.roiPercent.toStringAsFixed(1)}%'),
          ],
        ),
      ),
    );
  }
}