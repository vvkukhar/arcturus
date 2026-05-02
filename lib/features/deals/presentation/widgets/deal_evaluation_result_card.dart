import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/deals/application/deal_evaluation_model.dart';

class DealEvaluationResultCard extends StatelessWidget {
  final DealEvaluationModel model;

  const DealEvaluationResultCard({
    super.key,
    required this.model,
  });

  Color _color() {
    switch (model.verdict) {
      case 'strong buy':
        return Colors.green;
      case 'good':
        return Colors.lightGreen;
      case 'weak':
        return Colors.orange;
      default:
        return Colors.red;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    model.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 18,
                    ),
                  ),
                ),
                Text(
                  model.verdict,
                  style: TextStyle(
                    color: color,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _row('Asking', model.askingPrice.toStringAsFixed(2)),
            _row('Market', model.marketPrice.toStringAsFixed(2)),
            _row('Expected Profit', model.expectedProfit.toStringAsFixed(2)),
            _row('Margin', '${model.marginPercent.toStringAsFixed(1)}%'),
          ],
        ),
      ),
    );
  }

  Widget _row(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}
