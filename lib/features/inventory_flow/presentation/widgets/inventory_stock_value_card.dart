import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_stock_value_model.dart';

class InventoryStockValueCard extends StatelessWidget {
  final InventoryStockValueModel model;
  final String currency;

  const InventoryStockValueCard({
    super.key,
    required this.model,
    required this.currency,
  });

  Widget _cell(String label, String value) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 4),
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
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            Row(
              children: [
                _cell('Remaining units', model.remainingUnits.toString()),
                _cell(
                  'Remaining value',
                  '${model.remainingCostValue.toStringAsFixed(2)} $currency',
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell(
                  'Sold cost',
                  '${model.soldCostValue.toStringAsFixed(2)} $currency',
                ),
                _cell(
                  'Total cost',
                  '${model.totalCostValue.toStringAsFixed(2)} $currency',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}