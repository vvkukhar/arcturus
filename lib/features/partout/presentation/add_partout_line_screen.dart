import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/enums/partout_line_status.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/core/utils/number_parser.dart';
import 'package:lego_trading_manager/data/models/partout_line_model.dart';

class AddPartOutLineScreen extends ConsumerStatefulWidget {
  final String projectId;

  const AddPartOutLineScreen({
    super.key,
    required this.projectId,
  });

  @override
  ConsumerState<AddPartOutLineScreen> createState() => _AddPartOutLineScreenState();
}

class _AddPartOutLineScreenState extends ConsumerState<AddPartOutLineScreen> {
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

  void _save(I18nNotifier i18n) {
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
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Add Part-out Line')),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _titleController,
              decoration: InputDecoration(labelText: '${i18n.t('inv.title')} *'),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return i18n.t('inv.titleReq');
                }
                return null;
              },
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<ItemType>(
              value: _itemType,
              decoration: InputDecoration(labelText: i18n.t('inv.type')),
              items: ItemType.values
                  .map(
                    (type) => DropdownMenuItem(
                      value: type,
                      child: Text(i18n.t(type.name)),
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
              decoration: InputDecoration(labelText: i18n.t('inv.status')),
              items: PartOutLineStatus.values
                  .map(
                    (status) => DropdownMenuItem(
                      value: status,
                      child: Text(i18n.t(status.name)),
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
              decoration: InputDecoration(labelText: i18n.t('inv.qty')),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _expectedUnitPriceController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration:
                  InputDecoration(labelText: i18n.t('Expected Unit Price')),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  '${i18n.t('Expected')} Total: ${_expectedTotal.toStringAsFixed(2)}',
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
                  InputDecoration(labelText: i18n.t('Actual Total Price')),
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: () => _save(i18n),
              child: Text(i18n.t('Save Line')),
            ),
          ],
        ),
      ),
    );
  }
}