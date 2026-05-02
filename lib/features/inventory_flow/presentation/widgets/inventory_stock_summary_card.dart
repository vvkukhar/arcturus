import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_stock_summary_model.dart';

class InventoryStockSummaryCard extends StatelessWidget {
  final InventoryStockSummaryModel model;

  const InventoryStockSummaryCard({
    super.key,
    required this.model,
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
            style: const TextStyle(
              fontWeight: FontWeight.w900,
            ),
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
                _cell('Purchased', model.totalPurchasedUnits.toString()),
                _cell('Sold', model.totalSoldUnits.toString()),
                _cell('Remaining', model.totalRemainingUnits.toString()),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Open lots', model.openPurchaseLots.toString()),
                _cell('Closed lots', model.fullySoldLots.toString()),
              ],
            ),
          ],
        ),
      ),
    );
  }
}