import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sales_stock_flow_summary_model.dart';

class SalesStockFlowSummaryCard extends StatelessWidget {
  final SalesStockFlowSummaryModel model;

  const SalesStockFlowSummaryCard({
    super.key,
    required this.model,
  });

  Widget _cell(String label, String value, {Color? color}) {
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
            style: TextStyle(
              fontWeight: FontWeight.w900,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final hasProblems = model.openSales > 0 ||
        model.partiallyAllocatedSales > 0 ||
        model.overAllocatedSales > 0;

    final color = hasProblems ? Colors.orange : Colors.green;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  hasProblems
                      ? Icons.warning_amber_outlined
                      : Icons.check_circle_outline,
                  color: color,
                ),
                const SizedBox(width: 10),
                const Expanded(
                  child: Text(
                    'Sales Stock Flow',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Sales', model.totalSales.toString()),
                _cell('Full', model.fullyAllocatedSales.toString()),
                _cell('Open', model.openSales.toString(), color: color),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Partial', model.partiallyAllocatedSales.toString()),
                _cell('Over', model.overAllocatedSales.toString()),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Units', '${model.allocatedUnits}/${model.totalUnits}'),
                _cell('Open units', model.openUnits.toString(), color: color),
              ],
            ),
          ],
        ),
      ),
    );
  }
}