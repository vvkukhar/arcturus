import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_insights_provider.dart';

class EditMarketSnapshotScreen extends ConsumerStatefulWidget {
  final MarketSnapshotModel snapshot;

  const EditMarketSnapshotScreen({
    super.key,
    required this.snapshot,
  });

  @override
  ConsumerState<EditMarketSnapshotScreen> createState() =>
      _EditMarketSnapshotScreenState();
}

class _EditMarketSnapshotScreenState
    extends ConsumerState<EditMarketSnapshotScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _sourceController;
  late final TextEditingController _lowPriceController;
  late final TextEditingController _averagePriceController;
  late final TextEditingController _highPriceController;
  late final TextEditingController _currencyController;
  late final TextEditingController _sellerCountController;
  late final TextEditingController _availableQtyController;
  late final TextEditingController _urlController;

  @override
  void initState() {
    super.initState();
    final s = widget.snapshot;
    _sourceController = TextEditingController(text: s.source);
    _lowPriceController = TextEditingController(text: s.lowPrice.toString());
    _averagePriceController =
        TextEditingController(text: s.averagePrice.toString());
    _highPriceController = TextEditingController(text: s.highPrice.toString());
    _currencyController = TextEditingController(text: s.currency);
    _sellerCountController =
        TextEditingController(text: s.sellerCount?.toString() ?? '');
    _availableQtyController =
        TextEditingController(text: s.availableQty?.toString() ?? '');
    _urlController = TextEditingController(text: s.url ?? '');
  }

  @override
  void dispose() {
    _sourceController.dispose();
    _lowPriceController.dispose();
    _averagePriceController.dispose();
    _highPriceController.dispose();
    _currencyController.dispose();
    _sellerCountController.dispose();
    _availableQtyController.dispose();
    _urlController.dispose();
    super.dispose();
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;

    final formValues = ref.read(marketSnapshotFormValuesServiceProvider);

    final updated = widget.snapshot.copyWith(
      source: _sourceController.text.trim(),
      lowPrice: formValues.parseDouble(_lowPriceController.text),
      averagePrice: formValues.parseDouble(_averagePriceController.text),
      highPrice: formValues.parseDouble(_highPriceController.text),
      currency: _currencyController.text.trim(),
      sellerCount: formValues.parseIntOrNull(_sellerCountController.text),
      availableQty: formValues.parseIntOrNull(_availableQtyController.text),
      url: _urlController.text.trim().isEmpty
          ? null
          : _urlController.text.trim(),
    );

    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    final formValues = ref.watch(marketSnapshotFormValuesServiceProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    final low = formValues.parseDouble(_lowPriceController.text);
    final average = formValues.parseDouble(_averagePriceController.text);
    final high = formValues.parseDouble(_highPriceController.text);
    final spread = formValues.spread(low: low, high: high);
    final midpoint = formValues.midpoint(low: low, high: high);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Edit Snapshot')),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _sourceController,
              decoration: InputDecoration(labelText: i18n.t('Source')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _lowPriceController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('inv.marketLow')),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _averagePriceController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('inv.marketAvg')),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _highPriceController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('High Price')),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _MetricRow(
                      label: i18n.t('Spread'),
                      value: spread.toStringAsFixed(2),
                    ),
                    _MetricRow(
                      label: i18n.t('Midpoint'),
                      value: midpoint.toStringAsFixed(2),
                    ),
                    _MetricRow(
                      label: i18n.t('Average'),
                      value: average.toStringAsFixed(2),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _currencyController,
              decoration: InputDecoration(labelText: i18n.t('pur.currency')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _sellerCountController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(labelText: i18n.t('Seller Count')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _availableQtyController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(labelText: i18n.t('Available Qty')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _urlController,
              decoration: InputDecoration(labelText: i18n.t('URL')),
            ),
            const SizedBox(height: 20),
            FilledButton(
              onPressed: _save,
              child: Text(i18n.t('common.saveChanges')),
            ),
          ],
        ),
      ),
    );
  }
}

class _MetricRow extends StatelessWidget {
  final String label;
  final String value;

  const _MetricRow({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}