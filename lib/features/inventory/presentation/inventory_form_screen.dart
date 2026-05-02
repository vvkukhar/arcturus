import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/operator/data/operator_api_repository_provider.dart';

class InventoryFormScreen extends ConsumerStatefulWidget {
  final String itemId;

  const InventoryFormScreen({super.key, required this.itemId});

  @override
  ConsumerState<InventoryFormScreen> createState() =>
      _InventoryFormScreenState();
}

class _InventoryFormScreenState extends ConsumerState<InventoryFormScreen> {
  final _priceController = TextEditingController();
  final _qtyController = TextEditingController();
  bool _sealed = false;

  @override
  void dispose() {
    _priceController.dispose();
    _qtyController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final api = ref.watch(operatorApiRepositoryProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Add Inventory')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _priceController,
              decoration: const InputDecoration(labelText: 'Purchase Price'),
            ),
            TextField(
              controller: _qtyController,
              decoration: const InputDecoration(labelText: 'Quantity'),
            ),
            SwitchListTile(
              value: _sealed,
              onChanged: (v) => setState(() => _sealed = v),
              title: const Text('Sealed'),
            ),
            const SizedBox(height: 12),
            FilledButton(
              onPressed: () async {
                final navigator = Navigator.of(context);

                await api.createInventory(
                  itemId: widget.itemId,
                  purchasePrice:
                      double.tryParse(_priceController.text.replaceAll(',', '.')) ??
                          0,
                  quantity: int.tryParse(_qtyController.text) ?? 1,
                  sealed: _sealed,
                );

                if (!mounted) return;
                navigator.pop();
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
  }
}