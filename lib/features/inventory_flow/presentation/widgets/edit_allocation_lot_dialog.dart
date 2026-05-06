import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_lot_view_model.dart';

class EditAllocationLotDialog extends ConsumerStatefulWidget {
  final SaleAllocationLotViewModel lot;
  final int maxQuantity;

  const EditAllocationLotDialog({
    super.key,
    required this.lot,
    required this.maxQuantity,
  });

  @override
  ConsumerState<EditAllocationLotDialog> createState() =>
      _EditAllocationLotDialogState();
}

class _EditAllocationLotDialogState extends ConsumerState<EditAllocationLotDialog> {
  late final TextEditingController _quantityController;

  @override
  void initState() {
    super.initState();

    _quantityController = TextEditingController(
      text: widget.lot.quantity.toString(),
    );
  }

  @override
  void dispose() {
    _quantityController.dispose();
    super.dispose();
  }

  void _save(I18nNotifier i18n) {
    final quantity = int.tryParse(_quantityController.text.trim());

    if (quantity == null || quantity <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(i18n.t('Quantity must be greater than zero'))),
      );
      return;
    }

    if (quantity > widget.maxQuantity) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${i18n.t('Max available quantity is')} ${widget.maxQuantity}'),
        ),
      );
      return;
    }

    Navigator.of(context).pop(quantity);
  }

  @override
  Widget build(BuildContext context) {
    final i18n = ref.watch(i18nProvider.notifier);

    return AlertDialog(
      title: Text(i18n.t('Edit Allocation Lot')),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            widget.lot.source,
            style: const TextStyle(fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 8),
          Text('${i18n.t('Unit cost:')} ${widget.lot.unitCost.toStringAsFixed(2)}'),
          const SizedBox(height: 12),
          TextField(
            controller: _quantityController,
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              labelText: i18n.t('inv.qty'),
              helperText: '${i18n.t('Max:')} ${widget.maxQuantity}',
            ),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text(i18n.t('common.cancel')),
        ),
        FilledButton(
          onPressed: () => _save(i18n),
          child: Text(i18n.t('common.save')),
        ),
      ],
    );
  }
}