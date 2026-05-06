import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
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
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(i18n.t('inv.add'))),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _priceController,
              decoration: InputDecoration(labelText: i18n.t('inv.price')),
            ),
            TextField(
              controller: _qtyController,
              decoration: InputDecoration(labelText: i18n.t('inv.qty')),
            ),
            SwitchListTile(
              value: _sealed,
              onChanged: (v) => setState(() => _sealed = v),
              title: Text(i18n.t('inv.condition')),
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
              child: Text(i18n.t('common.save')),
            ),
          ],
        ),
      ),
    );
  }
}