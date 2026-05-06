import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';

class AddWatchlistItemScreen extends ConsumerStatefulWidget {
  const AddWatchlistItemScreen({super.key});

  @override
  ConsumerState<AddWatchlistItemScreen> createState() => _AddWatchlistItemScreenState();
}

class _AddWatchlistItemScreenState extends ConsumerState<AddWatchlistItemScreen> {
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

  void _save(I18nNotifier i18n) {
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
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Add Watchlist Item')),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _titleController,
              decoration: InputDecoration(labelText: '${i18n.t('Title')} *'),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return i18n.t('inv.titleReq');
                }
                return null;
              },
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<ItemType>(
              value: _itemType,
              decoration: InputDecoration(labelText: i18n.t('inv.type')),
              items: ItemType.values
                  .map(
                    (type) => DropdownMenuItem(
                      value: type,
                      child: Text(i18n.t(type.name)),
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
              decoration: InputDecoration(labelText: i18n.t('inv.theme')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _refIdController,
              decoration: InputDecoration(labelText: i18n.t('Reference ID')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _desiredBuyController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('Desired Buy Price')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _maxBuyController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('Max Buy Price')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _marketController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('Market Price')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _commentController,
              maxLines: 4,
              decoration: InputDecoration(labelText: i18n.t('Comment')),
            ),
            const SizedBox(height: 20),
            FilledButton(
              onPressed: () => _save(i18n),
              child: Text(i18n.t('Save Watchlist Item')),
            ),
          ],
        ),
      ),
    );
  }
}