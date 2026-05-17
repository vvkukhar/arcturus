import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/deals/application/deals_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

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
    final i18n = ref.read(i18nProvider.notifier);
    if (_result != null) {
      await ref.read(dealsEngineProvider.notifier).saveEvaluation(_result!);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(i18n.t('eval.itemCreated'))));
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(i18n.t('eval.title'), style: const TextStyle(fontWeight: FontWeight.w900))),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          TextField(controller: _title, decoration: InputDecoration(labelText: i18n.t('form.title'))),
          const SizedBox(height: 12),
          TextField(controller: _ask, keyboardType: TextInputType.number, decoration: InputDecoration(labelText: i18n.t('eval.askingPrice'))),
          const SizedBox(height: 12),
          TextField(controller: _market, keyboardType: TextInputType.number, decoration: InputDecoration(labelText: i18n.t('eval.marketPrice'))),
          const SizedBox(height: 24),
          FilledButton(
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
            onPressed: _evaluate,
            child: Text(i18n.t('eval.evaluate'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 24),
          if (_result != null) _buildResultCard(_result!, i18n),
        ],
      ),
    );
  }

  Widget _buildResultCard(DealEvaluation model, I18nNotifier i18n) {
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
          _Row(i18n.t('inv.expectedProfit'), model.expectedProfit.toStringAsFixed(2)),
          _Row('Margin', '${model.marginPercent.toStringAsFixed(1)}%'),
          const SizedBox(height: 24),
          FilledButton.tonalIcon(
            onPressed: _save,
            icon: const Icon(Icons.save),
            label: Text(i18n.t('common.save')),
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