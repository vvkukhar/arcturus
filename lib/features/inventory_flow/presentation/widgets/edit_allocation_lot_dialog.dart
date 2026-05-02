import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_lot_view_model.dart';

class EditAllocationLotDialog extends StatefulWidget {
  final SaleAllocationLotViewModel lot;
  final int maxQuantity;

  const EditAllocationLotDialog({
    super.key,
    required this.lot,
    required this.maxQuantity,
  });

  @override
  State<EditAllocationLotDialog> createState() =>
      _EditAllocationLotDialogState();
}

class _EditAllocationLotDialogState extends State<EditAllocationLotDialog> {
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

  void _save() {
    final quantity = int.tryParse(_quantityController.text.trim());

    if (quantity == null || quantity <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Quantity must be greater than zero')),
      );
      return;
    }

    if (quantity > widget.maxQuantity) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Max available quantity is ${widget.maxQuantity}'),
        ),
      );
      return;
    }

    Navigator.of(context).pop(quantity);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Edit Allocation Lot'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            widget.lot.source,
            style: const TextStyle(fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 8),
          Text('Unit cost: ${widget.lot.unitCost.toStringAsFixed(2)}'),
          const SizedBox(height: 12),
          TextField(
            controller: _quantityController,
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              labelText: 'Quantity',
              helperText: 'Max: ${widget.maxQuantity}',
            ),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: _save,
          child: const Text('Save'),
        ),
      ],
    );
  }
}