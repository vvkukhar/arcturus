import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/sales/application/sales_filter_model.dart';

class SalesFilterSheet extends StatefulWidget {
  final SalesFilterModel initialFilter;

  const SalesFilterSheet({
    super.key,
    required this.initialFilter,
  });

  @override
  State<SalesFilterSheet> createState() => _SalesFilterSheetState();
}

class _SalesFilterSheetState extends State<SalesFilterSheet> {
  late final TextEditingController _platformController;
  late final TextEditingController _buyerController;
  late final TextEditingController _minNetController;
  late final TextEditingController _maxNetController;

  double? _parseOptionalDouble(String value) {
    final text = value.trim();
    if (text.isEmpty) return null;
    return double.tryParse(text.replaceAll(',', '.'));
  }

  @override
  void initState() {
    super.initState();

    final filter = widget.initialFilter;

    _platformController = TextEditingController(
      text: filter.platformContains ?? '',
    );
    _buyerController = TextEditingController(
      text: filter.buyerContains ?? '',
    );
    _minNetController = TextEditingController(
      text: filter.minNet?.toString() ?? '',
    );
    _maxNetController = TextEditingController(
      text: filter.maxNet?.toString() ?? '',
    );
  }

  @override
  void dispose() {
    _platformController.dispose();
    _buyerController.dispose();
    _minNetController.dispose();
    _maxNetController.dispose();
    super.dispose();
  }

  void _apply() {
    Navigator.of(context).pop(
      SalesFilterModel(
        platformContains: _platformController.text.trim().isEmpty
            ? null
            : _platformController.text.trim(),
        buyerContains: _buyerController.text.trim().isEmpty
            ? null
            : _buyerController.text.trim(),
        minNet: _parseOptionalDouble(_minNetController.text),
        maxNet: _parseOptionalDouble(_maxNetController.text),
      ),
    );
  }

  void _clear() {
    Navigator.of(context).pop(SalesFilterModel.empty);
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
              'Sales Filters',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _platformController,
              decoration: const InputDecoration(
                labelText: 'Platform contains',
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _buyerController,
              decoration: const InputDecoration(
                labelText: 'Buyer contains',
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _minNetController,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: const InputDecoration(
                labelText: 'Min net',
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _maxNetController,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: const InputDecoration(
                labelText: 'Max net',
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