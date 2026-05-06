import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/deals/application/deal_evaluation_model.dart';

class DealEvaluationResultCard extends ConsumerWidget {
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
  Widget build(BuildContext context, WidgetRef ref) {
    final color = _color();
    final i18n = ref.watch(i18nProvider.notifier);

    Widget row(String label, String value) {
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
            row(i18n.t('eval.askingPrice'), model.askingPrice.toStringAsFixed(2)),
            row(i18n.t('eval.marketPrice'), model.marketPrice.toStringAsFixed(2)),
            row(i18n.t('inv.expectedProfit'), model.expectedProfit.toStringAsFixed(2)),
            row(i18n.t('Margin'), '${model.marginPercent.toStringAsFixed(1)}%'),
          ],
        ),
      ),
    );
  }
}