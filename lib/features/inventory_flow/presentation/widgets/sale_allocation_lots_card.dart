import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_lot_view_model.dart';

class SaleAllocationLotsCard extends ConsumerWidget {
  final List<SaleAllocationLotViewModel> lots;
  final void Function(SaleAllocationLotViewModel lot)? onEditLot;
  final void Function(SaleAllocationLotViewModel lot)? onRemoveLot;

  const SaleAllocationLotsCard({
    super.key,
    required this.lots,
    this.onEditLot,
    this.onRemoveLot,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (lots.isEmpty) return const SizedBox.shrink();

    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t('Allocated Lots'),
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 10),
            ...lots.map(
              (lot) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        '${lot.source} • ${i18n.t('qty')} ${lot.quantity}',
                        style: const TextStyle(fontWeight: FontWeight.w700),
                      ),
                    ),
                    Text(
                      '${lot.totalCost.toStringAsFixed(2)} ${lot.currency}',
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    if (onEditLot != null) ...[
                      const SizedBox(width: 4),
                      IconButton(
                        onPressed: () => onEditLot!(lot),
                        icon: const Icon(Icons.edit_outlined),
                        tooltip: i18n.t('Edit lot'),
                      ),
                    ],
                    if (onRemoveLot != null) ...[
                      const SizedBox(width: 4),
                      IconButton(
                        onPressed: () => onRemoveLot!(lot),
                        icon: const Icon(Icons.close),
                        tooltip: i18n.t('Remove lot'),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}