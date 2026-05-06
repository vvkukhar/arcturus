import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

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
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(i18n.t('Add to Watchlist'))),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            controller: _titleController,
            decoration: InputDecoration(labelText: i18n.t('Title')),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _buyController,
            decoration: InputDecoration(labelText: i18n.t('Desired Buy')),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _maxController,
            decoration: InputDecoration(labelText: i18n.t('Max Buy')),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _sellController,
            decoration: InputDecoration(labelText: i18n.t('Target Sell')),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
          ),
          const SizedBox(height: 20),
          FilledButton(
            onPressed: _save,
            child: Text(i18n.t('common.save')),
          ),
        ],
      ),
    );
  }
}