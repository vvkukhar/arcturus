import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/enums/partout_line_status.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/core/utils/number_parser.dart';
import 'package:lego_trading_manager/data/models/partout_line_model.dart';

class AddPartOutLineScreen extends StatefulWidget {
  final String projectId;

  const AddPartOutLineScreen({
    super.key,
    required this.projectId,
  });

  @override
  State<AddPartOutLineScreen> createState() => _AddPartOutLineScreenState();
}

class _AddPartOutLineScreenState extends State<AddPartOutLineScreen> {
  final _formKey = GlobalKey<FormState>();

  final _titleController = TextEditingController();
  final _quantityController = TextEditingController(text: '1');
  final _expectedUnitPriceController = TextEditingController(text: '0');
  final _actualTotalPriceController = TextEditingController(text: '0');

  ItemType _itemType = ItemType.minifig;
  PartOutLineStatus _status = PartOutLineStatus.planned;

  int get _quantity => NumberParser.parseInt(_quantityController.text);

  double get _expectedUnit =>
      NumberParser.parseDouble(_expectedUnitPriceController.text);

  double get _expectedTotal => _quantity * _expectedUnit;

  void _save() {
    if (!_formKey.currentState!.validate()) return;

    final line = PartOutLineModel(
      id: IdGenerator.next(),
      projectId: widget.projectId,
      itemType: _itemType,
      itemRef: null,
      title: _titleController.text.trim(),
      quantity: _quantity,
      expectedUnitPrice: _expectedUnit,
      expectedTotalPrice: _expectedTotal,
      actualTotalPrice:
          NumberParser.parseDouble(_actualTotalPriceController.text),
      status: _status,
    );

    Navigator.of(context).pop(line);
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
        title: const Text('Add Part-out Line'),
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
                setState(() {
                  _itemType = value;
                });
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
                setState(() {
                  _status = value;
                });
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
              child: const Text('Save Line'),
            ),
          ],
        ),
      ),
    );
  }
}
