import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_validation_model.dart';

class SaleAllocationValidationCard extends ConsumerWidget {
  final SaleAllocationValidationModel model;

  const SaleAllocationValidationCard({
    super.key,
    required this.model,
  });

  Color _color() {
    if (model.isValid) return Colors.green;

    switch (model.label) {
      case 'partial allocation':
        return Colors.orange;
      case 'overallocated':
        return Colors.redAccent;
      default:
        return Colors.blueGrey;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final color = _color();
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Icon(
              model.isValid
                  ? Icons.check_circle_outline
                  : Icons.warning_amber_outlined,
              color: color,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                model.warning ?? i18n.t(model.label),
                style: const TextStyle(
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                i18n.t(model.label),
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}