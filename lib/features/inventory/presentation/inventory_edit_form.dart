import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class InventoryEditForm extends ConsumerStatefulWidget {
  final Map<String, dynamic> item;
  final Future<void> Function(Map<String, dynamic>) onSave;

  const InventoryEditForm({
    super.key,
    required this.item,
    required this.onSave,
  });

  @override
  ConsumerState<InventoryEditForm> createState() => _InventoryEditFormState();
}

class _InventoryEditFormState extends ConsumerState<InventoryEditForm> {
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
    final i18n = ref.watch(i18nProvider.notifier);

    return AlertDialog(
      title: Text(i18n.t('inv.edit')),
      content: TextField(
        controller: _priceController,
        keyboardType: const TextInputType.numberWithOptions(decimal: true),
        decoration: InputDecoration(
          labelText: i18n.t('inv.price'),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: Text(i18n.t('common.cancel')),
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
          child: Text(i18n.t('common.save')),
        ),
      ],
    );
  }
}