import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/number_parser.dart';
import 'package:lego_trading_manager/core/utils/partout_calculator.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';

class EditPartOutProjectScreen extends StatefulWidget {
  final PartOutProjectModel project;

  const EditPartOutProjectScreen({
    super.key,
    required this.project,
  });

  @override
  State<EditPartOutProjectScreen> createState() =>
      _EditPartOutProjectScreenState();
}

class _EditPartOutProjectScreenState extends State<EditPartOutProjectScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _purchaseCostController;
  late final TextEditingController _shippingCostController;
  late final TextEditingController _extraCostsController;
  late final TextEditingController _expectedValueController;
  late final TextEditingController _actualValueController;
  late final TextEditingController _notesController;

  double get _totalCost {
    return PartOutCalculator.totalCost(
      purchaseCost: NumberParser.parseDouble(_purchaseCostController.text),
      shippingCost: NumberParser.parseDouble(_shippingCostController.text),
      extraCosts: NumberParser.parseDouble(_extraCostsController.text),
    );
  }

  @override
  void initState() {
    super.initState();
    _purchaseCostController =
        TextEditingController(text: widget.project.purchaseCost.toString());
    _shippingCostController =
        TextEditingController(text: widget.project.shippingCost.toString());
    _extraCostsController =
        TextEditingController(text: widget.project.extraCosts.toString());
    _expectedValueController = TextEditingController(
        text: widget.project.expectedPartOutValue.toString());
    _actualValueController = TextEditingController(
        text: widget.project.actualPartOutValue.toString());
    _notesController = TextEditingController(text: widget.project.notes ?? '');
  }

  @override
  void dispose() {
    _purchaseCostController.dispose();
    _shippingCostController.dispose();
    _extraCostsController.dispose();
    _expectedValueController.dispose();
    _actualValueController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;

    final updated = widget.project.copyWith(
      purchaseCost: NumberParser.parseDouble(_purchaseCostController.text),
      shippingCost: NumberParser.parseDouble(_shippingCostController.text),
      extraCosts: NumberParser.parseDouble(_extraCostsController.text),
      totalCost: _totalCost,
      expectedPartOutValue:
          NumberParser.parseDouble(_expectedValueController.text),
      actualPartOutValue: NumberParser.parseDouble(_actualValueController.text),
      notes: _notesController.text.trim().isEmpty
          ? null
          : _notesController.text.trim(),
    );

    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Part-out Project'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(
              widget.project.sourceSetTitle,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _purchaseCostController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'Purchase Cost'),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _shippingCostController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'Shipping Cost'),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _extraCostsController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'Extra Costs'),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'Total Cost: ${_totalCost.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _expectedValueController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'Expected Value'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _actualValueController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'Actual Value'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _notesController,
              maxLines: 4,
              decoration: const InputDecoration(labelText: 'Notes'),
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