import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/core/widgets/details_action_bar.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/action_report_helper_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_duplicate_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_insights_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_model.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_provider.dart';
import 'package:lego_trading_manager/features/market/presentation/edit_market_snapshot_screen.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_snapshot_insight_card.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_snapshot_note_dialog.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_snapshot_notes_list.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_snapshot_report_bar.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';
import 'package:lego_trading_manager/features/settings/application/save_action_report_flow_provider.dart';

class MarketSnapshotDetailsScreen extends ConsumerStatefulWidget {
  final MarketSnapshotModel snapshot;

  const MarketSnapshotDetailsScreen({
    super.key,
    required this.snapshot,
  });

  @override
  ConsumerState<MarketSnapshotDetailsScreen> createState() =>
      _MarketSnapshotDetailsScreenState();
}

class _MarketSnapshotDetailsScreenState
    extends ConsumerState<MarketSnapshotDetailsScreen> {
  late MarketSnapshotModel snapshot;
  bool _loadingNotes = true;
  List<MarketSnapshotNoteModel> _notes = const [];

  @override
  void initState() {
    super.initState();
    snapshot = widget.snapshot;
    Future.microtask(_loadNotes);
  }

  Future<void> _loadNotes() async {
    final data =
        await ref.read(marketSnapshotNoteProvider).getBySnapshotId(snapshot.id);
    if (!mounted) return;

    setState(() {
      _notes = data;
      _loadingNotes = false;
    });
  }

  String _itemTitle(String itemRef) {
    return InventoryRepository().getById(itemRef)?.title ?? 'Unknown item';
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 140,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w700,
                color: Colors.white70,
              ),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  Future<void> _openEdit() async {
    final result = await Navigator.of(context).push<MarketSnapshotModel>(
      MaterialPageRoute(
        builder: (_) => EditMarketSnapshotScreen(snapshot: snapshot),
      ),
    );

    if (result != null) {
      setState(() {
        snapshot = result;
      });

      if (!mounted) return;
      Navigator.of(context).pop({'updated': result});
    }
  }

  void _duplicate() {
    final duplicate =
        ref.read(marketDuplicateServiceProvider).duplicate(snapshot);
    Navigator.of(context).pop({'duplicated': duplicate});
  }

  Future<void> _saveNote() async {
    final result = await showDialog<String>(
      context: context,
      builder: (_) => const MarketSnapshotNoteDialog(initialValue: ''),
    );

    if (result == null || result.trim().isEmpty) return;

    await ref.read(marketSnapshotNoteProvider).add(
          snapshotId: snapshot.id,
          note: result.trim(),
        );

    await ref.read(activityLogHelperProvider).marketAction(
          title: 'Market note saved',
          subtitle: '${snapshot.source} | ${result.trim()}',
        );

    await _loadNotes();

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Market note saved')),
    );
  }

  Future<void> _saveReport() async {
    final result = await ref.read(saveActionReportFlowProvider).openDialog(
          context,
          initialTitle: 'Market Snapshot Review',
          initialNote:
              'Reviewed ${snapshot.source} | avg=${snapshot.averagePrice.toStringAsFixed(2)} | spread=${(snapshot.highPrice - snapshot.lowPrice).toStringAsFixed(2)}',
        );

    if (result == null) return;

    final title = result['title'] ?? 'Market Snapshot Review';
    final note = result['note'] ?? '';

    await ref.read(actionReportHelperProvider).save(
          title: title,
          note: note,
        );

    await ref.read(activityLogHelperProvider).reportSaved(
          area: 'market',
          title: title,
        );

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Market report saved')),
    );
  }

  Future<void> _confirmDelete() async {
    final shouldDelete = await showDialog<bool>(
      context: context,
      builder: (_) {
        return AlertDialog(
          title: const Text('Delete snapshot'),
          content: const Text('Delete this market snapshot?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );

    if (shouldDelete == true && mounted) {
      Navigator.of(context).pop({
        'deleted': true,
        'id': snapshot.id,
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final itemTitle = _itemTitle(snapshot.itemRef);
    final settings = ref.watch(appSettingsControllerProvider);
    final insights = ref.watch(marketSnapshotInsightsServiceProvider);
    final currency =
        snapshot.currency.isEmpty ? settings.baseCurrency : snapshot.currency;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Snapshot Details'),
        actions: [
          DetailsActionBar(
            onEdit: _openEdit,
            onDelete: _confirmDelete,
            onDuplicate: _duplicate,
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                itemTitle,
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          MarketSnapshotReportBar(
            onSaveNote: _saveNote,
            onSaveReport: _saveReport,
          ),
          const SizedBox(height: 16),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.3,
            children: [
              MarketSnapshotInsightCard(
                title: 'Spread',
                value: CurrencyFormatter.format(
                  double.parse(insights.spread(snapshot)),
                  currency: currency,
                ),
                subtitle: 'high - low',
              ),
              MarketSnapshotInsightCard(
                title: 'Midpoint',
                value: CurrencyFormatter.format(
                  double.parse(insights.midpoint(snapshot)),
                  currency: currency,
                ),
                subtitle: 'between low and high',
              ),
              MarketSnapshotInsightCard(
                title: 'Avg vs Low',
                value: '${insights.avgVsLow(snapshot)}%',
                subtitle: 'average premium',
              ),
              MarketSnapshotInsightCard(
                title: 'Source',
                value: snapshot.source,
                subtitle: 'captured source',
              ),
            ],
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _infoRow('Source', snapshot.source),
                  _infoRow(
                    'Low Price',
                    CurrencyFormatter.format(
                      snapshot.lowPrice,
                      currency: currency,
                    ),
                  ),
                  _infoRow(
                    'Average Price',
                    CurrencyFormatter.format(
                      snapshot.averagePrice,
                      currency: currency,
                    ),
                  ),
                  _infoRow(
                    'High Price',
                    CurrencyFormatter.format(
                      snapshot.highPrice,
                      currency: currency,
                    ),
                  ),
                  _infoRow('Currency', snapshot.currency),
                  _infoRow(
                    'Seller Count',
                    snapshot.sellerCount?.toString() ?? '-',
                  ),
                  _infoRow(
                    'Available Qty',
                    snapshot.availableQty?.toString() ?? '-',
                  ),
                  _infoRow(
                    'Captured At',
                    snapshot.capturedAt.toIso8601String().split('T').first,
                  ),
                  _infoRow('URL', snapshot.url ?? '-'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Notes',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 12),
          _loadingNotes
              ? const Center(child: CircularProgressIndicator())
              : MarketSnapshotNotesList(notes: _notes),
        ],
      ),
    );
  }
}