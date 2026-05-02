import 'package:flutter/material.dart';

class InventoryRepriceSheet extends StatefulWidget {
  const InventoryRepriceSheet({super.key});

  @override
  State<InventoryRepriceSheet> createState() => _InventoryRepriceSheetState();
}

class _InventoryRepriceSheetState extends State<InventoryRepriceSheet> {
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
            const Text(
              'Bulk Reprice',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 16),
            RadioListTile<String>(
              value: 'market',
              groupValue: mode,
              onChanged: (value) => setState(() => mode = value!),
              title: const Text('Set expected = market average'),
            ),
            RadioListTile<String>(
              value: 'minus',
              groupValue: mode,
              onChanged: (value) => setState(() => mode = value!),
              title: const Text('Set expected = market minus %'),
            ),
            RadioListTile<String>(
              value: 'plus',
              groupValue: mode,
              onChanged: (value) => setState(() => mode = value!),
              title: const Text('Set expected = market plus %'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: percentController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'Percent'),
            ),
            const SizedBox(height: 20),
            FilledButton(
              onPressed: _submit,
              child: const Text('Apply'),
            ),
          ],
        ),
      ),
    );
  }
}