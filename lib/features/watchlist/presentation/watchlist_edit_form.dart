import 'package:flutter/material.dart';

class WatchlistEditForm extends StatefulWidget {
  final Map<String, dynamic> item;
  final Future<void> Function(Map<String, dynamic>) onSave;

  const WatchlistEditForm({
    super.key,
    required this.item,
    required this.onSave,
  });

  @override
  State<WatchlistEditForm> createState() => _WatchlistEditFormState();
}

class _WatchlistEditFormState extends State<WatchlistEditForm> {
  late final TextEditingController _priceController;
  String? _error;

  @override
  void initState() {
    super.initState();
    _priceController = TextEditingController(
      text: (widget.item['targetSellPrice'] ?? '').toString(),
    );
  }

  @override
  void dispose() {
    _priceController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    final parsed = double.tryParse(_priceController.text.replaceAll(',', '.'));

    if (parsed == null) {
      setState(() {
        _error = 'Enter valid target sell price';
      });
      return;
    }

    final navigator = Navigator.of(context);

    await widget.onSave({
      ...widget.item,
      'targetSellPrice': parsed,
    });

    if (!mounted) return;
    navigator.pop();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Edit Watchlist'),
      content: TextField(
        controller: _priceController,
        keyboardType: const TextInputType.numberWithOptions(decimal: true),
        decoration: InputDecoration(
          labelText: 'Target Sell Price',
          errorText: _error,
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
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