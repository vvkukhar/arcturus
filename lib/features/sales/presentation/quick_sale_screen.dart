import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/core/utils/profit_calculator.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/sales/application/sale_item_sync_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sale_record_payload.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';

class QuickSaleScreen extends ConsumerStatefulWidget {
  final ItemModel item;

  const QuickSaleScreen({
    super.key,
    required this.item,
  });

  @override
  ConsumerState<QuickSaleScreen> createState() => _QuickSaleScreenState();
}

class _QuickSaleScreenState extends ConsumerState<QuickSaleScreen> {
  final _formKey = GlobalKey<FormState>();

  final _buyerNameController = TextEditingController();
  final _salePriceController = TextEditingController(text: '0');
  final _platformFeeController = TextEditingController(text: '0');
  final _shippingPaidByMeController = TextEditingController(text: '0');
  final _shippingPaidByBuyerController = TextEditingController(text: '0');
  final _noteController = TextEditingController();

  late String _platform;

  double _parseDouble(String value) {
    return double.tryParse(value.replaceAll(',', '.')) ?? 0.0;
  }

  ProfitMetrics get _metrics {
    return ProfitCalculator.calculateSaleMetrics(
      purchasePrice: widget.item.purchasePrice,
      shippingToMe: widget.item.shippingToMe,
      extraCosts: widget.item.extraCosts,
      actualSalePrice: _parseDouble(_salePriceController.text),
      platformFee: _parseDouble(_platformFeeController.text),
      shippingPaidByMe: _parseDouble(_shippingPaidByMeController.text),
    );
  }

  void _applyDefaults() {
    final settings = ref.read(appSettingsControllerProvider);
    
    setState(() {
      _platformFeeController.text = ((_parseDouble(_salePriceController.text) * settings.defaultSaleFeePercent) / 100).toStringAsFixed(2);
      _shippingPaidByMeController.text = settings.defaultShippingPaidByMe.toString();
      _shippingPaidByBuyerController.text = settings.defaultShippingPaidByBuyer.toString();
    });
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;

    final metrics = _metrics;

    final sale = SaleModel(
      id: IdGenerator.next(),
      itemId: widget.item.id,
      platform: _platform,
      buyerName: _buyerNameController.text.trim().isEmpty
          ? null
          : _buyerNameController.text.trim(),
      salePrice: _parseDouble(_salePriceController.text),
      platformFee: _parseDouble(_platformFeeController.text),
      shippingPaidByMe: _parseDouble(_shippingPaidByMeController.text),
      shippingPaidByBuyer: _parseDouble(_shippingPaidByBuyerController.text),
      finalNet: metrics.netProfit,
      currency: ref.read(appSettingsControllerProvider).baseCurrency,
      saleDate: DateTime.now(),
      note: _noteController.text.trim().isEmpty
          ? null
          : _noteController.text.trim(),
    );

    final updatedItem = ref.read(saleItemSyncServiceProvider).applySale(
          item: widget.item,
          sale: sale,
        );

    Navigator.of(context).pop(
      SaleRecordPayload(
        sale: sale,
        updatedItem: updatedItem,
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    _platform = 'olx';
  }

  @override
  void dispose() {
    _buyerNameController.dispose();
    _salePriceController.dispose();
    _platformFeeController.dispose();
    _shippingPaidByMeController.dispose();
    _shippingPaidByBuyerController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final metrics = _metrics;
    final settings = ref.watch(appSettingsControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quick Sale'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.item.title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Cost: ${CurrencyFormatter.format(widget.item.totalCost, currency: settings.baseCurrency)}',
                    ),
                    const SizedBox(height: 4),
                    Text('Status: ${widget.item.status.name}'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: _platform,
              decoration: const InputDecoration(labelText: 'Platform'),
              items: ['olx', 'instagram', 'bricklink', 'facebook', 'other']
                  .map(
                    (platform) => DropdownMenuItem(
                      value: platform,
                      child: Text(platform),
                    ),
                  )
                  .toList(),
              onChanged: (value) {
                if (value == null) return;
                setState(() {
                  _platform = value;
                });
              },
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _buyerNameController,
              decoration: const InputDecoration(labelText: 'Buyer Name'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _salePriceController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                labelText: 'Sale Price * (${settings.baseCurrency})',
              ),
              onChanged: (_) => setState(() {}),
              validator: (value) {
                final parsed = double.tryParse((value ?? '0').replaceAll(',', '.')) ?? 0;
                if (parsed <= 0) {
                  return 'Enter sale price';
                }
                return null;
              },
            ),
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerLeft,
              child: OutlinedButton.icon(
                onPressed: _applyDefaults,
                icon: const Icon(Icons.auto_fix_high),
                label: const Text('Apply Default Fees'),
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _platformFeeController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                labelText: 'Platform Fee (${settings.baseCurrency})',
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _shippingPaidByMeController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                labelText: 'Shipping Paid By Me (${settings.baseCurrency})',
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _shippingPaidByBuyerController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                labelText: 'Shipping Paid By Buyer (${settings.baseCurrency})',
              ),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _MetricRow(
                      label: 'Total Cost',
                      value: CurrencyFormatter.format(
                        metrics.totalCost,
                        currency: settings.baseCurrency,
                      ),
                    ),
                    _MetricRow(
                      label: 'Net Profit',
                      value: CurrencyFormatter.format(
                        metrics.netProfit,
                        currency: settings.baseCurrency,
                      ),
                    ),
                    _MetricRow(
                      label: 'ROI',
                      value: '${metrics.roi.toStringAsFixed(2)}%',
                    ),
                    _MetricRow(
                      label: 'Margin',
                      value: '${metrics.margin.toStringAsFixed(2)}%',
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _noteController,
              maxLines: 4,
              decoration: const InputDecoration(labelText: 'Note'),
            ),
            const SizedBox(height: 20),
            FilledButton.icon(
              onPressed: _save,
              icon: const Icon(Icons.sell_outlined),
              label: const Text('Complete Quick Sale'),
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