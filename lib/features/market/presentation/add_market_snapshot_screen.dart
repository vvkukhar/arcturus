import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/local_datasources_provider.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_insights_provider.dart';

class AddMarketSnapshotScreen extends ConsumerStatefulWidget {
  const AddMarketSnapshotScreen({super.key});

  @override
  ConsumerState<AddMarketSnapshotScreen> createState() =>
      _AddMarketSnapshotScreenState();
}

class _AddMarketSnapshotScreenState
    extends ConsumerState<AddMarketSnapshotScreen> {
  final _formKey = GlobalKey<FormState>();
  late final InventoryRepository _inventoryRepository;

  String? _selectedItemId;

  final _sourceController = TextEditingController(text: 'bricklink');
  final _lowPriceController = TextEditingController(text: '0');
  final _averagePriceController = TextEditingController(text: '0');
  final _highPriceController = TextEditingController(text: '0');
  final _currencyController = TextEditingController(text: 'USD');
  final _sellerCountController = TextEditingController();
  final _availableQtyController = TextEditingController();
  final _urlController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _inventoryRepository = InventoryRepository(ref.read(inventoryLocalDatasourceProvider));
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedItemId == null) return;

    final formValues = ref.read(marketSnapshotFormValuesServiceProvider);

    final snapshot = MarketSnapshotModel(
      id: IdGenerator.next(),
      itemRef: _selectedItemId!,
      source: _sourceController.text.trim(),
      lowPrice: formValues.parseDouble(_lowPriceController.text),
      averagePrice: formValues.parseDouble(_averagePriceController.text),
      highPrice: formValues.parseDouble(_highPriceController.text),
      currency: _currencyController.text.trim(),
      sellerCount: formValues.parseIntOrNull(_sellerCountController.text),
      availableQty: formValues.parseIntOrNull(_availableQtyController.text),
      capturedAt: DateTime.now(),
      url: _urlController.text.trim().isEmpty
          ? null
          : _urlController.text.trim(),
    );

    Navigator.of(context).pop(snapshot);
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

  @override
  Widget build(BuildContext context) {
    final items = _inventoryRepository.getAllItems();
    final formValues = ref.watch(marketSnapshotFormValuesServiceProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    final low = formValues.parseDouble(_lowPriceController.text);
    final average = formValues.parseDouble(_averagePriceController.text);
    final high = formValues.parseDouble(_highPriceController.text);
    final spread = formValues.spread(low: low, high: high);
    final midpoint = formValues.midpoint(low: low, high: high);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('market.add')),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            DropdownButtonFormField<String>(
              value: _selectedItemId,
              decoration: InputDecoration(labelText: '${i18n.t('Item')} *'),
              items: items
                  .map(
                    (ItemModel item) => DropdownMenuItem(
                      value: item.id,
                      child: Text(item.title),
                    ),
                  )
                  .toList(),
              onChanged: (value) {
                setState(() {
                  _selectedItemId = value;
                });
              },
              validator: (value) => value == null ? 'Select item' : null,
            ),
            const SizedBox(height: 12),
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
              child: Text(i18n.t('common.save')),
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