import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/core/widgets/details_action_bar.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_duplicate_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/item_lifecycle_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/item_timeline_provider.dart';
import 'package:lego_trading_manager/features/inventory/presentation/edit_item_screen.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/item_lifecycle_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/item_timeline_card.dart';
import 'package:lego_trading_manager/features/item_details/application/item_detail_insights_provider.dart';
import 'package:lego_trading_manager/features/item_details/presentation/widgets/item_detail_header_card.dart';
import 'package:lego_trading_manager/features/item_details/presentation/widgets/item_detail_insight_card.dart';
import 'package:lego_trading_manager/features/item_details/presentation/widgets/item_detail_notes_card.dart';
import 'package:lego_trading_manager/features/item_details/presentation/widgets/item_detail_tags_card.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';

class ItemDetailsScreen extends ConsumerStatefulWidget {
  final ItemModel item;

  const ItemDetailsScreen({
    super.key,
    required this.item,
  });

  @override
  ConsumerState<ItemDetailsScreen> createState() => _ItemDetailsScreenState();
}

class _ItemDetailsScreenState extends ConsumerState<ItemDetailsScreen> {
  late ItemModel item;

  @override
  void initState() {
    super.initState();
    item = widget.item;
  }

  String _formatNullable(Object? value) {
    if (value == null) return '-';
    final text = value.toString().trim();
    return text.isEmpty ? '-' : text;
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

  void _updateItem(ItemModel next) {
    ref.read(inventoryRepositoryProvider).updateItem(next);
    setState(() {
      item = next;
    });
  }

  void _deleteItem(BuildContext context) {
    ref.read(inventoryRepositoryProvider).deleteItem(item.id);
    Navigator.of(context).pop({'deleted': true});
  }

  Future<void> _confirmDelete(BuildContext context, I18nNotifier i18n) async {
    final shouldDelete = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(i18n.t('common.deleteConfirmTitle')),
          content: Text(i18n.t('common.deleteConfirmText', {'title': item.title})),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: Text(i18n.t('common.cancel')),
            ),
            FilledButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: Text(i18n.t('common.delete')),
            ),
          ],
        );
      },
    );
    if (shouldDelete == true && context.mounted) {
      _deleteItem(context);
    }
  }

  Future<void> _openEdit() async {
    final result = await Navigator.of(context).push<ItemModel>(
      MaterialPageRoute(
        builder: (_) => EditItemScreen(item: item),
      ),
    );
    if (result != null) {
      _updateItem(result);
    }
  }

  void _duplicate() {
    final duplicate = ref.read(inventoryDuplicateServiceProvider).duplicate(item);
    Navigator.of(context).pop({'duplicated': duplicate});
  }

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(appSettingsControllerProvider);
    final insights = ref.watch(itemDetailInsightsProvider).build(item);
    final timeline = ref.watch(itemTimelineServiceProvider).build(item);
    final lifecycle = ref.watch(itemLifecycleServiceProvider).build(item);
    final sale = ref.watch(salesRepositoryProvider).getByItemId(item.id);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('inv.details')),
        actions: [
          DetailsActionBar(
            onEdit: _openEdit,
            onDelete: () => _confirmDelete(context, i18n),
            onDuplicate: _duplicate,
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ItemDetailHeaderCard(item: item),
          const SizedBox(height: 16),
          _SectionTitle(i18n.t('inv.lifecycle')),
          ItemLifecycleCard(steps: lifecycle),
          const SizedBox(height: 16),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.3,
            children: insights
                .map((insight) => ItemDetailInsightCard(insight: insight))
                .toList(),
          ),
          const SizedBox(height: 16),
          _SectionTitle(i18n.t('inv.timeline')),
          if (timeline.isEmpty)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(i18n.t('inv.noTimeline')),
              ),
            )
          else
            ...timeline.map(
              (event) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: ItemTimelineCard(event: event),
              ),
            ),
          const SizedBox(height: 16),
          _SectionTitle(i18n.t('inv.overview')),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _infoRow(i18n.t('Title'), item.title),
                  _infoRow(i18n.t('inv.type'), i18n.t(item.type.name)),
                  _infoRow(i18n.t('inv.theme'), _formatNullable(item.theme)),
                  _infoRow(i18n.t('inv.condition'), i18n.t(item.condition.name)),
                  _infoRow(i18n.t('inv.qty'), item.quantity.toString()),
                  _infoRow(
                    i18n.t('inv.daysInInv'),
                    (item.daysInInventory ?? 0).toString(),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          _SectionTitle(i18n.t('inv.financials')),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _infoRow(
                    i18n.t('inv.totalCost'),
                    CurrencyFormatter.format(
                      item.totalCost,
                      currency: settings.baseCurrency,
                    ),
                  ),
                  _infoRow(
                    i18n.t('inv.marketAvg'),
                    item.marketAverage == null
                        ? '-'
                        : CurrencyFormatter.format(
                            item.marketAverage!,
                            currency: settings.baseCurrency,
                          ),
                  ),
                ],
              ),
            ),
          ),
          if (sale != null) ...[
            const SizedBox(height: 16),
            _SectionTitle(i18n.t('inv.saleRecord')),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _infoRow(i18n.t('sale.platform'), sale.platform),
                    _infoRow(
                      i18n.t('inv.netProfit'),
                      CurrencyFormatter.format(
                        sale.finalNet,
                        currency: settings.baseCurrency,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
          const SizedBox(height: 16),
          _SectionTitle(i18n.t('inv.notes')),
          ItemDetailNotesCard(notes: item.notes),
          const SizedBox(height: 16),
          _SectionTitle(i18n.t('inv.tags')),
          ItemDetailTagsCard(
            tags: item.tags.map((e) => e.toString()).toList(),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  const _SectionTitle(this.title);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}