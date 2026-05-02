import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';

class AddWatchlistItemScreen extends StatefulWidget {
  const AddWatchlistItemScreen({super.key});

  @override
  State<AddWatchlistItemScreen> createState() => _AddWatchlistItemScreenState();
}

class _AddWatchlistItemScreenState extends State<AddWatchlistItemScreen> {
  final _formKey = GlobalKey<FormState>();

  final _titleController = TextEditingController();
  final _themeController = TextEditingController();
  final _refIdController = TextEditingController();
  final _desiredBuyController = TextEditingController(text: '0');
  final _maxBuyController = TextEditingController(text: '0');
  final _marketController = TextEditingController();
  final _commentController = TextEditingController();

  ItemType _itemType = ItemType.minifig;

  double _parseDouble(String value) {
    return double.tryParse(value.replaceAll(',', '.')) ?? 0;
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;

    final item = WatchlistItemModel(
      id: IdGenerator.next(),
      title: _titleController.text.trim(),
      type: _itemType,
      theme: _themeController.text.trim().isEmpty
          ? null
          : _themeController.text.trim(),
      refId: _refIdController.text.trim().isEmpty
          ? null
          : _refIdController.text.trim(),
      desiredBuyPrice: _parseDouble(_desiredBuyController.text),
      maxBuyPrice: _parseDouble(_maxBuyController.text),
      marketPrice: _marketController.text.trim().isEmpty
          ? null
          : _parseDouble(_marketController.text),
      comment: _commentController.text.trim().isEmpty
          ? null
          : _commentController.text.trim(),
      createdAt: DateTime.now(),
      isActive: true,
    );

    Navigator.of(context).pop(item);
  }

  @override
  void dispose() {
    _titleController.dispose();
    _themeController.dispose();
    _refIdController.dispose();
    _desiredBuyController.dispose();
    _maxBuyController.dispose();
    _marketController.dispose();
    _commentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Watchlist Item'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _titleController,
              decoration: const InputDecoration(labelText: 'Title *'),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Title is required';
                }
                return null;
              },
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<ItemType>(
              value: _itemType,
              decoration: const InputDecoration(labelText: 'Type'),
              items: ItemType.values
                  .map(
                    (type) => DropdownMenuItem(
                      value: type,
                      child: Text(type.name),
                    ),
                  )
                  .toList(),
              onChanged: (value) {
                if (value == null) return;
                setState(() {
                  _itemType = value;
                });
              },
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _themeController,
              decoration: const InputDecoration(labelText: 'Theme'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _refIdController,
              decoration: const InputDecoration(labelText: 'Reference ID'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _desiredBuyController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'Desired Buy Price'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _maxBuyController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'Max Buy Price'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _marketController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'Market Price'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _commentController,
              maxLines: 4,
              decoration: const InputDecoration(labelText: 'Comment'),
            ),
            const SizedBox(height: 20),
            FilledButton(
              onPressed: _save,
              child: const Text('Save Watchlist Item'),
            ),
          ],
        ),
      ),
    );
  }
}
