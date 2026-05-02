import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/enums/item_completeness.dart';
import 'package:lego_trading_manager/core/enums/item_condition.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/enums/ownership_type.dart';
import 'package:lego_trading_manager/core/utils/profit_calculator.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';

class EditItemScreen extends StatefulWidget {
  final ItemModel item;

  const EditItemScreen({
    super.key,
    required this.item,
  });

  @override
  State<EditItemScreen> createState() => _EditItemScreenState();
}

class _EditItemScreenState extends State<EditItemScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _titleController;
  late final TextEditingController _themeController;
  late final TextEditingController _subthemeController;
  late final TextEditingController _legoNumberController;
  late final TextEditingController _minifigIdController;
  late final TextEditingController _setIdController;
  late final TextEditingController _purchasePriceController;
  late final TextEditingController _shippingToMeController;
  late final TextEditingController _extraCostsController;
  late final TextEditingController _marketLowController;
  late final TextEditingController _marketAverageController;
  late final TextEditingController _expectedSalePriceController;
  late final TextEditingController _actualSalePriceController;
  late final TextEditingController _platformBoughtController;
  late final TextEditingController _platformSoldController;
  late final TextEditingController _notesController;
  late final TextEditingController _tagsController;

  late ItemType _selectedType;
  late ItemCondition _selectedCondition;
  late ItemCompleteness _selectedCompleteness;
  late OwnershipType _selectedOwnershipType;
  late ItemStatus _selectedStatus;

  double _parseDouble(String value) {
    return double.tryParse(value.replaceAll(',', '.')) ?? 0;
  }

  double get _calculatedTotalCost {
    return ProfitCalculator.calculateTotalCost(
      purchasePrice: _parseDouble(_purchasePriceController.text),
      shippingToMe: _parseDouble(_shippingToMeController.text),
      extraCosts: _parseDouble(_extraCostsController.text),
    );
  }

  @override
  void initState() {
    super.initState();

    final item = widget.item;

    _titleController = TextEditingController(text: item.title);
    _themeController = TextEditingController(text: item.theme ?? '');
    _subthemeController = TextEditingController(text: item.subtheme ?? '');
    _legoNumberController = TextEditingController(text: item.legoNumber ?? '');
    _minifigIdController = TextEditingController(text: item.minifigId ?? '');
    _setIdController = TextEditingController(text: item.setId ?? '');
    _purchasePriceController =
        TextEditingController(text: item.purchasePrice.toString());
    _shippingToMeController =
        TextEditingController(text: item.shippingToMe.toString());
    _extraCostsController =
        TextEditingController(text: item.extraCosts.toString());
    _marketLowController =
        TextEditingController(text: item.marketLow?.toString() ?? '');
    _marketAverageController =
        TextEditingController(text: item.marketAverage?.toString() ?? '');
    _expectedSalePriceController =
        TextEditingController(text: item.expectedSalePrice?.toString() ?? '');
    _actualSalePriceController =
        TextEditingController(text: item.actualSalePrice?.toString() ?? '');
    _platformBoughtController =
        TextEditingController(text: item.platformBought ?? '');
    _platformSoldController =
        TextEditingController(text: item.platformSold ?? '');
    _notesController = TextEditingController(text: item.notes ?? '');
    _tagsController = TextEditingController(text: item.tags.join(', '));

    _selectedType = item.type;
    _selectedCondition = item.condition;
    _selectedCompleteness = item.completeness;
    _selectedOwnershipType = item.ownershipType;
    _selectedStatus = item.status;
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;

    final updatedItem = widget.item.copyWith(
      title: _titleController.text.trim(),
      type: _selectedType,
      theme: _themeController.text.trim().isEmpty
          ? null
          : _themeController.text.trim(),
      subtheme: _subthemeController.text.trim().isEmpty
          ? null
          : _subthemeController.text.trim(),
      legoNumber: _legoNumberController.text.trim().isEmpty
          ? null
          : _legoNumberController.text.trim(),
      minifigId: _minifigIdController.text.trim().isEmpty
          ? null
          : _minifigIdController.text.trim(),
      setId: _setIdController.text.trim().isEmpty
          ? null
          : _setIdController.text.trim(),
      condition: _selectedCondition,
      completeness: _selectedCompleteness,
      ownershipType: _selectedOwnershipType,
      purchasePrice: _parseDouble(_purchasePriceController.text),
      shippingToMe: _parseDouble(_shippingToMeController.text),
      extraCosts: _parseDouble(_extraCostsController.text),
      totalCost: _calculatedTotalCost,
      marketLow: _marketLowController.text.trim().isEmpty
          ? null
          : _parseDouble(_marketLowController.text),
      marketAverage: _marketAverageController.text.trim().isEmpty
          ? null
          : _parseDouble(_marketAverageController.text),
      expectedSalePrice: _expectedSalePriceController.text.trim().isEmpty
          ? null
          : _parseDouble(_expectedSalePriceController.text),
      actualSalePrice: _actualSalePriceController.text.trim().isEmpty
          ? null
          : _parseDouble(_actualSalePriceController.text),
      platformBought: _platformBoughtController.text.trim().isEmpty
          ? null
          : _platformBoughtController.text.trim(),
      platformSold: _platformSoldController.text.trim().isEmpty
          ? null
          : _platformSoldController.text.trim(),
      status: _selectedStatus,
      notes: _notesController.text.trim().isEmpty
          ? null
          : _notesController.text.trim(),
      tags: _tagsController.text
          .split(',')
          .map((e) => e.trim())
          .where((e) => e.isNotEmpty)
          .toList(),
    );

    Navigator.of(context).pop(updatedItem);
  }

  Widget _buildDropdown<T>({
    required String label,
    required T value,
    required List<T> values,
    required void Function(T?) onChanged,
  }) {
    return DropdownButtonFormField<T>(
      value: value,
      decoration: InputDecoration(labelText: label),
      items: values
          .map(
            (e) => DropdownMenuItem<T>(
              value: e,
              child: Text(e.toString().split('.').last),
            ),
          )
          .toList(),
      onChanged: onChanged,
    );
  }

  Widget _buildNumberField(String label, TextEditingController controller) {
    return TextFormField(
      controller: controller,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      decoration: InputDecoration(labelText: label),
      onChanged: (_) => setState(() {}),
    );
  }

  @override
  void dispose() {
    _titleController.dispose();
    _themeController.dispose();
    _subthemeController.dispose();
    _legoNumberController.dispose();
    _minifigIdController.dispose();
    _setIdController.dispose();
    _purchasePriceController.dispose();
    _shippingToMeController.dispose();
    _extraCostsController.dispose();
    _marketLowController.dispose();
    _marketAverageController.dispose();
    _expectedSalePriceController.dispose();
    _actualSalePriceController.dispose();
    _platformBoughtController.dispose();
    _platformSoldController.dispose();
    _notesController.dispose();
    _tagsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final expectedSale = _parseDouble(_expectedSalePriceController.text);
    final expectedProfit = expectedSale - _calculatedTotalCost;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Item'),
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
            _buildDropdown<ItemType>(
              label: 'Type',
              value: _selectedType,
              values: ItemType.values,
              onChanged: (value) {
                if (value == null) return;
                setState(() => _selectedType = value);
              },
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _themeController,
              decoration: const InputDecoration(labelText: 'Theme'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _subthemeController,
              decoration: const InputDecoration(labelText: 'Subtheme'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _legoNumberController,
              decoration: const InputDecoration(labelText: 'LEGO Number'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _minifigIdController,
              decoration: const InputDecoration(labelText: 'Minifig ID'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _setIdController,
              decoration: const InputDecoration(labelText: 'Set ID'),
            ),
            const SizedBox(height: 12),
            _buildDropdown<ItemCondition>(
              label: 'Condition',
              value: _selectedCondition,
              values: ItemCondition.values,
              onChanged: (value) {
                if (value == null) return;
                setState(() => _selectedCondition = value);
              },
            ),
            const SizedBox(height: 12),
            _buildDropdown<ItemCompleteness>(
              label: 'Completeness',
              value: _selectedCompleteness,
              values: ItemCompleteness.values,
              onChanged: (value) {
                if (value == null) return;
                setState(() => _selectedCompleteness = value);
              },
            ),
            const SizedBox(height: 12),
            _buildDropdown<OwnershipType>(
              label: 'Ownership Type',
              value: _selectedOwnershipType,
              values: OwnershipType.values,
              onChanged: (value) {
                if (value == null) return;
                setState(() => _selectedOwnershipType = value);
              },
            ),
            const SizedBox(height: 12),
            _buildDropdown<ItemStatus>(
              label: 'Status',
              value: _selectedStatus,
              values: ItemStatus.values,
              onChanged: (value) {
                if (value == null) return;
                setState(() => _selectedStatus = value);
              },
            ),
            const SizedBox(height: 12),
            _buildNumberField('Purchase Price', _purchasePriceController),
            const SizedBox(height: 12),
            _buildNumberField('Shipping To Me', _shippingToMeController),
            const SizedBox(height: 12),
            _buildNumberField('Extra Costs', _extraCostsController),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'Calculated Total Cost: ${_calculatedTotalCost.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            _buildNumberField('Market Low', _marketLowController),
            const SizedBox(height: 12),
            _buildNumberField('Market Average', _marketAverageController),
            const SizedBox(height: 12),
            _buildNumberField('Expected Sale Price', _expectedSalePriceController),
            const SizedBox(height: 12),
            _buildNumberField('Actual Sale Price', _actualSalePriceController),
            const SizedBox(height: 12),
            TextFormField(
              controller: _platformBoughtController,
              decoration: const InputDecoration(labelText: 'Platform Bought'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _platformSoldController,
              decoration: const InputDecoration(labelText: 'Platform Sold'),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'Expected Profit: ${expectedProfit.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _tagsController,
              decoration: const InputDecoration(
                labelText: 'Tags',
                hintText: 'rare, fast sell, villain',
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _notesController,
              maxLines: 4,
              decoration: const InputDecoration(labelText: 'Notes'),
            ),
            const SizedBox(height: 20),
            FilledButton(
              onPressed: _save,
              child: const Text('Save Changes'),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}