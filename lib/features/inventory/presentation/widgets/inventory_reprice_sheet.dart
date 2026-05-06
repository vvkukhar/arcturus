import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class InventoryRepriceSheet extends ConsumerStatefulWidget {
  const InventoryRepriceSheet({super.key});

  @override
  ConsumerState<InventoryRepriceSheet> createState() => _InventoryRepriceSheetState();
}

class _InventoryRepriceSheetState extends ConsumerState<InventoryRepriceSheet> {
  String mode = 'market';
  final percentController = TextEditingController(text: '3');

  @override
  void dispose() {
    percentController.dispose();
    super.dispose();
  }

  void _submit() {
    Navigator.of(context).pop({
      'mode': mode,
      'percent':
          double.tryParse(percentController.text.replaceAll(',', '.')) ?? 0,
    });
  }

  @override
  Widget build(BuildContext context) {
    final i18n = ref.watch(i18nProvider.notifier);

    return SafeArea(
      child: Padding(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          top: 16,
          bottom: 16 + MediaQuery.of(context).viewInsets.bottom,
        ),
        child: ListView(
          shrinkWrap: true,
          children: [
            Text(
              i18n.t('Bulk Reprice'),
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 16),
            RadioListTile<String>(
              value: 'market',
              groupValue: mode,
              onChanged: (value) => setState(() => mode = value!),
              title: Text(i18n.t('Set expected = market average')),
            ),
            RadioListTile<String>(
              value: 'minus',
              groupValue: mode,
              onChanged: (value) => setState(() => mode = value!),
              title: Text(i18n.t('Set expected = market minus %')),
            ),
            RadioListTile<String>(
              value: 'plus',
              groupValue: mode,
              onChanged: (value) => setState(() => mode = value!),
              title: Text(i18n.t('Set expected = market plus %')),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: percentController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('Percent')),
            ),
            const SizedBox(height: 20),
            FilledButton(
              onPressed: _submit,
              child: Text(i18n.t('common.apply')),
            ),
          ],
        ),
      ),
    );
  }
}