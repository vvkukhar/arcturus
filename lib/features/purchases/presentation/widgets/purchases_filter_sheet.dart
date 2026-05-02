import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_filter_model.dart';

class PurchasesFilterSheet extends StatefulWidget {
  final PurchasesFilterModel initialFilter;

  const PurchasesFilterSheet({
    super.key,
    required this.initialFilter,
  });

  @override
  State<PurchasesFilterSheet> createState() => _PurchasesFilterSheetState();
}

class _PurchasesFilterSheetState extends State<PurchasesFilterSheet> {
  late final TextEditingController _sourceController;
  late final TextEditingController _currencyController;
  late final TextEditingController _minTotalController;
  late final TextEditingController _maxTotalController;

  double? _parseOptionalDouble(String value) {
    final text = value.trim();
    if (text.isEmpty) return null;
    return double.tryParse(text.replaceAll(',', '.'));
  }

  @override
  void initState() {
    super.initState();

    final filter = widget.initialFilter;

    _sourceController = TextEditingController(
      text: filter.sourceContains ?? '',
    );
    _currencyController = TextEditingController(
      text: filter.currency ?? '',
    );
    _minTotalController = TextEditingController(
      text: filter.minTotal?.toString() ?? '',
    );
    _maxTotalController = TextEditingController(
      text: filter.maxTotal?.toString() ?? '',
    );
  }

  @override
  void dispose() {
    _sourceController.dispose();
    _currencyController.dispose();
    _minTotalController.dispose();
    _maxTotalController.dispose();
    super.dispose();
  }

  void _apply() {
    Navigator.of(context).pop(
      PurchasesFilterModel(
        sourceContains: _sourceController.text.trim().isEmpty
            ? null
            : _sourceController.text.trim(),
        currency: _currencyController.text.trim().isEmpty
            ? null
            : _currencyController.text.trim().toUpperCase(),
        minTotal: _parseOptionalDouble(_minTotalController.text),
        maxTotal: _parseOptionalDouble(_maxTotalController.text),
      ),
    );
  }

  void _clear() {
    Navigator.of(context).pop(PurchasesFilterModel.empty);
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          top: 16,
          bottom: 16 + MediaQuery.of(context).viewInsets.bottom,
        ),
        child: ListView(
          shrinkWrap: true,
          children: [
            const Text(
              'Purchase Filters',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _sourceController,
              decoration: const InputDecoration(
                labelText: 'Source contains',
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _currencyController,
              decoration: const InputDecoration(
                labelText: 'Currency',
              ),
              textCapitalization: TextCapitalization.characters,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _minTotalController,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: const InputDecoration(
                labelText: 'Min total',
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _maxTotalController,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: const InputDecoration(
                labelText: 'Max total',
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _clear,
                    child: const Text('Clear'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: _apply,
                    child: const Text('Apply'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}