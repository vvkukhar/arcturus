import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_filter_model.dart';

class PurchasesFilterSheet extends ConsumerStatefulWidget {
  final PurchasesFilterModel initialFilter;

  const PurchasesFilterSheet({
    super.key,
    required this.initialFilter,
  });

  @override
  ConsumerState<PurchasesFilterSheet> createState() => _PurchasesFilterSheetState();
}

class _PurchasesFilterSheetState extends ConsumerState<PurchasesFilterSheet> {
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
    final i18n = ref.watch(i18nProvider.notifier);

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
            Text(
              i18n.t('Purchase Filters'),
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _sourceController,
              decoration: InputDecoration(
                labelText: i18n.t('Source contains'),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _currencyController,
              decoration: InputDecoration(
                labelText: i18n.t('Currency'),
              ),
              textCapitalization: TextCapitalization.characters,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _minTotalController,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: InputDecoration(
                labelText: i18n.t('Min total'),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _maxTotalController,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: InputDecoration(
                labelText: i18n.t('Max total'),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _clear,
                    child: Text(i18n.t('common.clear')),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: _apply,
                    child: Text(i18n.t('common.apply')),
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