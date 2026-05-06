import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/local_datasources_provider.dart';
import 'package:lego_trading_manager/core/enums/partout_project_status.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/core/utils/number_parser.dart';
import 'package:lego_trading_manager/core/utils/partout_calculator.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';

class AddPartOutProjectScreen extends ConsumerStatefulWidget {
  const AddPartOutProjectScreen({super.key});

  @override
  ConsumerState<AddPartOutProjectScreen> createState() =>
      _AddPartOutProjectScreenState();
}

class _AddPartOutProjectScreenState extends ConsumerState<AddPartOutProjectScreen> {
  final _formKey = GlobalKey<FormState>();
  late final InventoryRepository _inventoryRepository;

  String? _selectedItemId;
  final _purchaseCostController = TextEditingController(text: '0');
  final _shippingCostController = TextEditingController(text: '0');
  final _extraCostsController = TextEditingController(text: '0');
  final _notesController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _inventoryRepository = InventoryRepository(ref.read(inventoryLocalDatasourceProvider));
  }

  ItemModel? get _selectedItem {
    if (_selectedItemId == null) return null;
    return _inventoryRepository.getById(_selectedItemId!);
  }

  double get _totalCost {
    return PartOutCalculator.totalCost(
      purchaseCost: NumberParser.parseDouble(_purchaseCostController.text),
      shippingCost: NumberParser.parseDouble(_shippingCostController.text),
      extraCosts: NumberParser.parseDouble(_extraCostsController.text),
    );
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;
    final item = _selectedItem;
    if (item == null) return;

    final project = PartOutProjectModel(
      id: IdGenerator.next(),
      sourceSetId: item.id,
      sourceSetTitle: item.title,
      purchaseCost: NumberParser.parseDouble(_purchaseCostController.text),
      shippingCost: NumberParser.parseDouble(_shippingCostController.text),
      extraCosts: NumberParser.parseDouble(_extraCostsController.text),
      totalCost: _totalCost,
      expectedPartOutValue: 0,
      actualPartOutValue: 0,
      status: PartOutProjectStatus.active,
      notes: _notesController.text.trim().isEmpty
          ? null
          : _notesController.text.trim(),
      createdAt: DateTime.now(),
    );

    Navigator.of(context).pop(project);
  }

  @override
  void dispose() {
    _purchaseCostController.dispose();
    _shippingCostController.dispose();
    _extraCostsController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final setItems = _inventoryRepository
        .getAllItems()
        .where((item) => item.type.name == 'set')
        .toList();
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('partout.add')),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            DropdownButtonFormField<String>(
              value: _selectedItemId,
              decoration: InputDecoration(labelText: '${i18n.t('Source Set')} *'),
              items: setItems
                  .map(
                    (item) => DropdownMenuItem(
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
              validator: (value) => value == null ? i18n.t('Select source set') : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _purchaseCostController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('pur.price')),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _shippingCostController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('pur.shipping')),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _extraCostsController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('pur.extra')),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  '${i18n.t('inv.totalCost')}: ${_totalCost.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _notesController,
              maxLines: 4,
              decoration: InputDecoration(labelText: i18n.t('inv.notes')),
            ),
            const SizedBox(height: 16),
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