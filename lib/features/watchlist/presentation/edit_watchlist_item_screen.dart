import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';

class EditWatchlistItemScreen extends StatefulWidget {
  final WatchlistItemModel item;

  const EditWatchlistItemScreen({
    super.key,
    required this.item,
  });

  @override
  State<EditWatchlistItemScreen> createState() =>
      _EditWatchlistItemScreenState();
}

class _EditWatchlistItemScreenState extends State<EditWatchlistItemScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _titleController;
  late final TextEditingController _themeController;
  late final TextEditingController _refIdController;
  late final TextEditingController _desiredBuyController;
  late final TextEditingController _maxBuyController;
  late final TextEditingController _marketController;
  late final TextEditingController _commentController;

  late bool _isActive;
  late ItemType _itemType;

  double _parseDouble(String value) {
    return double.tryParse(value.replaceAll(',', '.')) ?? 0;
  }

  @override
  void initState() {
    super.initState();
    final item = widget.item;

    _titleController = TextEditingController(text: item.title);
    _themeController = TextEditingController(text: item.theme ?? '');
    _refIdController = TextEditingController(text: item.refId ?? '');
    _desiredBuyController =
        TextEditingController(text: item.desiredBuyPrice.toString());
    _maxBuyController =
        TextEditingController(text: item.maxBuyPrice.toString());
    _marketController =
        TextEditingController(text: item.marketPrice?.toString() ?? '');
    _commentController = TextEditingController(text: item.comment ?? '');

    _isActive = item.isActive;
    _itemType = item.type;
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

  void _save() {
    if (!_formKey.currentState!.validate()) return;

    final updated = widget.item.copyWith(
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
      isActive: _isActive,
    );

    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Watchlist Item'),
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
                    (type) => DropdownMenuItem<ItemType>(
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
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Active'),
              value: _isActive,
              onChanged: (value) {
                setState(() {
                  _isActive = value;
                });
              },
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
              child: const Text('Save Changes'),
            ),
          ],
        ),
      ),
    );
  }
}