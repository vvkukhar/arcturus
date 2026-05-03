import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';
import 'package:lego_trading_manager/features/deals/application/deal_evaluation_model.dart';
import 'package:lego_trading_manager/features/deals/application/deal_history_provider.dart';
import 'package:lego_trading_manager/features/deals/application/deal_watchlist_create_provider.dart';
import 'package:lego_trading_manager/features/deals/application/deal_to_watchlist_draft_provider.dart';
import 'package:lego_trading_manager/features/deals/application/deal_evaluator_provider.dart';
import 'package:lego_trading_manager/features/deals/presentation/deal_to_watchlist_preview_screen.dart';
import 'package:lego_trading_manager/features/deals/presentation/widgets/deal_create_watchlist_button.dart';
import 'package:lego_trading_manager/features/deals/presentation/widgets/deal_evaluation_result_card.dart';
import 'package:lego_trading_manager/features/deals/presentation/widgets/deal_to_watchlist_button.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';

class DealEvaluatorScreen extends ConsumerStatefulWidget {
  const DealEvaluatorScreen({super.key});

  @override
  ConsumerState<DealEvaluatorScreen> createState() => _DealEvaluatorScreenState();
}

class _DealEvaluatorScreenState extends ConsumerState<DealEvaluatorScreen> {
  final _titleController = TextEditingController();
  final _askingController = TextEditingController(text: '0');
  final _marketController = TextEditingController(text: '0');

  DealEvaluationModel? _result;

  double _parse(String value) {
    return double.tryParse(value.replaceAll(',', '.')) ?? 0;
  }

  Future<void> _evaluate() async {
    final result = ref.read(dealEvaluatorProvider).evaluate(
          title: _titleController.text.trim().isEmpty ? 'Untitled Deal' : _titleController.text.trim(),
          askingPrice: _parse(_askingController.text),
          marketPrice: _parse(_marketController.text),
        );

    await ref.read(dealHistoryServiceProvider).add(result);

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Deal evaluated',
          subtitle: '${result.title} | ${result.verdict} | ${result.marginPercent.toStringAsFixed(1)}%',
        );

    setState(() {
      _result = result;
    });
  }

  void _openWatchlistDraft() {
    if (_result == null) return;

    final draft = ref.read(dealToWatchlistDraftProvider).build(_result!);

    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => DealToWatchlistPreviewScreen(draft: draft)),
    );
  }

  Future<void> _createWatchlistItem() async {
    if (_result == null) return;

    final result = ref.read(dealWatchlistCreateProvider).build(_result!);
    ref.read(watchlistControllerProvider.notifier).addItem(result.watchlistItem);

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Watchlist item created from deal',
          subtitle: result.watchlistItem.title,
        );

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Watchlist item created from deal')),
    );
  }

  @override
  void dispose() {
    _titleController.dispose();
    _askingController.dispose();
    _marketController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Deal Evaluator'),
        actions: [
          IconButton(
            onPressed: () => Navigator.of(context).pushNamed('/deal-history'),
            icon: const Icon(Icons.history),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            controller: _titleController,
            decoration: const InputDecoration(labelText: 'Title'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _askingController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(labelText: 'Asking Price'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _marketController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(labelText: 'Market Price'),
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: _evaluate,
            child: const Text('Evaluate'),
          ),
          const SizedBox(height: 16),
          if (_result != null) ...[
            DealEvaluationResultCard(model: _result!),
            const SizedBox(height: 12),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                DealToWatchlistButton(onPressed: _openWatchlistDraft),
                DealCreateWatchlistButton(onPressed: _createWatchlistItem),
              ],
            ),
          ],
        ],
      ),
    );
  }
}