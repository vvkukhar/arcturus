import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class WatchlistFormScreen extends ConsumerStatefulWidget {
  final String itemId;

  const WatchlistFormScreen({
    super.key,
    required this.itemId,
  });

  @override
  ConsumerState<WatchlistFormScreen> createState() =>
      _WatchlistFormScreenState();
}

class _WatchlistFormScreenState extends ConsumerState<WatchlistFormScreen> {
  final _titleController = TextEditingController();
  final _buyController = TextEditingController();
  final _maxController = TextEditingController();
  final _sellController = TextEditingController();

  @override
  void dispose() {
    _titleController.dispose();
    _buyController.dispose();
    _maxController.dispose();
    _sellController.dispose();
    super.dispose();
  }

  double _parse(String value) {
    return double.tryParse(value.replaceAll(',', '.')) ?? 0;
  }

  void _save() {
    Navigator.of(context).pop({
      'itemId': widget.itemId,
      'title': _titleController.text.trim(),
      'desiredBuyPrice': _parse(_buyController.text),
      'maxBuyPrice': _parse(_maxController.text),
      'targetSellPrice': _parse(_sellController.text),
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add to Watchlist')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            controller: _titleController,
            decoration: const InputDecoration(labelText: 'Title'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _buyController,
            decoration: const InputDecoration(labelText: 'Desired Buy'),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _maxController,
            decoration: const InputDecoration(labelText: 'Max Buy'),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _sellController,
            decoration: const InputDecoration(labelText: 'Target Sell'),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
          ),
          const SizedBox(height: 20),
          FilledButton(
            onPressed: _save,
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
}