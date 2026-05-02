import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/enums/partout_line_status.dart';
import 'package:lego_trading_manager/core/utils/number_parser.dart';
import 'package:lego_trading_manager/data/models/partout_line_model.dart';

class EditPartOutLineScreen extends StatefulWidget {
  final PartOutLineModel line;

  const EditPartOutLineScreen({
    super.key,
    required this.line,
  });

  @override
  State<EditPartOutLineScreen> createState() => _EditPartOutLineScreenState();
}

class _EditPartOutLineScreenState extends State<EditPartOutLineScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _titleController;
  late final TextEditingController _quantityController;
  late final TextEditingController _expectedUnitPriceController;
  late final TextEditingController _actualTotalPriceController;

  late ItemType _itemType;
  late PartOutLineStatus _status;

  int get _quantity => NumberParser.parseInt(_quantityController.text);
  double get _expectedUnit =>
      NumberParser.parseDouble(_expectedUnitPriceController.text);
  double get _expectedTotal => _quantity * _expectedUnit;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.line.title);
    _quantityController =
        TextEditingController(text: widget.line.quantity.toString());
    _expectedUnitPriceController =
        TextEditingController(text: widget.line.expectedUnitPrice.toString());
    _actualTotalPriceController =
        TextEditingController(text: widget.line.actualTotalPrice.toString());
    _itemType = widget.line.itemType;
    _status = widget.line.status;
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;

    Navigator.of(context).pop(
      widget.line.copyWith(
        title: _titleController.text.trim(),
        itemType: _itemType,
        quantity: _quantity,
        expectedUnitPrice: _expectedUnit,
        expectedTotalPrice: _expectedTotal,
        actualTotalPrice:
            NumberParser.parseDouble(_actualTotalPriceController.text),
        status: _status,
      ),
    );
  }

  @override
  void dispose() {
    _titleController.dispose();
    _quantityController.dispose();
    _expectedUnitPriceController.dispose();
    _actualTotalPriceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Part-out Line'),
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
            DropdownButtonFormField<ItemType>(
              value: _itemType,
              decoration: const InputDecoration(labelText: 'Item Type'),
              items: ItemType.values
                  .map(
                    (type) => DropdownMenuItem(
                      value: type,
                      child: Text(type.name),
                    ),
                  )
                  .toList(),
              onChanged: (value) {
                if (value == null) return;
                setState(() => _itemType = value);
              },
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<PartOutLineStatus>(
              value: _status,
              decoration: const InputDecoration(labelText: 'Status'),
              items: PartOutLineStatus.values
                  .map(
                    (status) => DropdownMenuItem(
                      value: status,
                      child: Text(status.name),
                    ),
                  )
                  .toList(),
              onChanged: (value) {
                if (value == null) return;
                setState(() => _status = value);
              },
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _quantityController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Quantity'),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _expectedUnitPriceController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration:
                  const InputDecoration(labelText: 'Expected Unit Price'),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'Expected Total: ${_expectedTotal.toStringAsFixed(2)}',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _actualTotalPriceController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration:
                  const InputDecoration(labelText: 'Actual Total Price'),
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: _save,
              child: const Text('Save Changes'),
            ),
          ],
        ),
      ),
    );
  }
}
