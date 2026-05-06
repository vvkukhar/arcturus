import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class WatchlistEditForm extends ConsumerStatefulWidget {
  final Map<String, dynamic> item;
  final Future<void> Function(Map<String, dynamic>) onSave;

  const WatchlistEditForm({
    super.key,
    required this.item,
    required this.onSave,
  });

  @override
  ConsumerState<WatchlistEditForm> createState() => _WatchlistEditFormState();
}

class _WatchlistEditFormState extends ConsumerState<WatchlistEditForm> {
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

  Future<void> _save(I18nNotifier i18n) async {
    final parsed = double.tryParse(_priceController.text.replaceAll(',', '.'));

    if (parsed == null) {
      setState(() {
        _error = i18n.t('Enter valid target sell price');
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
    final i18n = ref.watch(i18nProvider.notifier);

    return AlertDialog(
      title: Text(i18n.t('Edit Watchlist')),
      content: TextField(
        controller: _priceController,
        keyboardType: const TextInputType.numberWithOptions(decimal: true),
        decoration: InputDecoration(
          labelText: i18n.t('Target Sell Price'),
          errorText: _error,
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: Text(i18n.t('common.cancel')),
        ),
        FilledButton(
          onPressed: () => _save(i18n),
          child: Text(i18n.t('common.save')),
        ),
      ],
    );
  }
}