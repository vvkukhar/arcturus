import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_stock_flow_status_model.dart';

class SaleStockFlowStatusBadge extends ConsumerWidget {
  final SaleStockFlowStatusModel model;

  const SaleStockFlowStatusBadge({
    super.key,
    required this.model,
  });

  Color _color() {
    if (model.isOverAllocated) return Colors.redAccent;
    if (model.isFullyAllocated) return Colors.green;
    if (model.allocatedQuantity > 0) return Colors.orange;
    return Colors.blueGrey;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final color = _color();
    final i18n = ref.watch(i18nProvider.notifier);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        '${i18n.t(model.label)} ${model.allocatedQuantity}/${model.saleQuantity}',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }
}