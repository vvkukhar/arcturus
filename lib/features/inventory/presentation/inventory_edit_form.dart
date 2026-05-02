import 'package:flutter/material.dart';

class InventoryEditForm extends StatefulWidget {
  final Map<String, dynamic> item;
  final Future<void> Function(Map<String, dynamic>) onSave;

  const InventoryEditForm({
    super.key,
    required this.item,
    required this.onSave,
  });

  @override
  State<InventoryEditForm> createState() => _InventoryEditFormState();
}

class _InventoryEditFormState extends State<InventoryEditForm> {
  late final TextEditingController _priceController;

  @override
  void initState() {
    super.initState();
    _priceController = TextEditingController(
      text: (widget.item['purchasePrice'] ?? '').toString(),
    );
  }

  @override
  void dispose() {
    _priceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Edit Inventory'),
      content: TextField(
        controller: _priceController,
        keyboardType: const TextInputType.numberWithOptions(decimal: true),
        decoration: const InputDecoration(
          labelText: 'Purchase Price',
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: () async {
            final navigator = Navigator.of(context);

            await widget.onSave({
              ...widget.item,
              'purchasePrice': double.tryParse(
                    _priceController.text.replaceAll(',', '.'),
                  ) ??
                  0,
            });

            if (!mounted) return;
            navigator.pop();
          },
          child: const Text('Save'),
        ),
      ],
    );
  }
}