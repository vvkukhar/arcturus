import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/deals/application/deals_engine.dart';

class DealEvaluatorScreen extends ConsumerStatefulWidget {
  const DealEvaluatorScreen({super.key});

  @override
  ConsumerState<DealEvaluatorScreen> createState() => _DealEvaluatorScreenState();
}

class _DealEvaluatorScreenState extends ConsumerState<DealEvaluatorScreen> {
  final _title = TextEditingController();
  final _ask = TextEditingController();
  final _market = TextEditingController();
  DealEvaluation? _result;

  void _evaluate() {
    final ask = double.tryParse(_ask.text.replaceAll(',', '.')) ?? 0;
    final market = double.tryParse(_market.text.replaceAll(',', '.')) ?? 0;
    
    setState(() {
      _result = ref.read(dealsEngineProvider.notifier).evaluate(
        title: _title.text,
        askingPrice: ask,
        marketPrice: market,
      );
    });
  }

  Future<void> _save() async {
    if (_result != null) {
      await ref.read(dealsEngineProvider.notifier).saveEvaluation(_result!);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Deal saved to history')));
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Deal Evaluator', style: TextStyle(fontWeight: FontWeight.w900))),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          TextField(controller: _title, decoration: const InputDecoration(labelText: 'Deal Title')),
          const SizedBox(height: 12),
          TextField(controller: _ask, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Asking Price')),
          const SizedBox(height: 12),
          TextField(controller: _market, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Market Price')),
          const SizedBox(height: 24),
          FilledButton(
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
            onPressed: _evaluate,
            child: const Text('Evaluate', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 24),
          if (_result != null) _buildResultCard(_result!),
        ],
      ),
    );
  }

  Widget _buildResultCard(DealEvaluation model) {
    final color = model.verdict == 'strong buy' ? Colors.green : model.verdict == 'good' ? Colors.lightGreen : model.verdict == 'weak' ? Colors.orange : Colors.red;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        border: Border.all(color: color.withValues(alpha: 0.3)),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          Text(model.verdict.toUpperCase(), style: TextStyle(color: color, fontSize: 24, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
          const Divider(height: 32, color: Colors.white10),
          _Row('Expected Profit', model.expectedProfit.toStringAsFixed(2)),
          _Row('Margin', '${model.marginPercent.toStringAsFixed(1)}%'),
          const SizedBox(height: 24),
          FilledButton.tonalIcon(
            onPressed: _save,
            icon: const Icon(Icons.save),
            label: const Text('Save to History'),
          )
        ],
      ),
    );
  }
}

class _Row extends StatelessWidget {
  final String label;
  final String value;
  const _Row(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.white70)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        ],
      ),
    );
  }
}