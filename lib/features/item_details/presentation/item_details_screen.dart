import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/core/widgets/details_action_bar.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/market_repository.dart';
import 'package:lego_trading_manager/data/repositories/partout_repository.dart';
import 'package:lego_trading_manager/data/repositories/sales_repository.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_duplicate_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/item_lifecycle_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/item_quick_reprice_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/item_status_transition_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/item_timeline_provider.dart';
import 'package:lego_trading_manager/features/inventory/presentation/edit_item_screen.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/item_lifecycle_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/item_quick_decision_bar.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/item_quick_reprice_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/item_status_action_card.dart';
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
    InventoryRepository().updateItem(next);
    setState(() {
      item = next;
    });
  }

  void _deleteItem(BuildContext context) {
    final repo = InventoryRepository();
    repo.deleteItem(item.id);
    Navigator.of(context).pop({'deleted': true});
  }

  Future<void> _confirmDelete(BuildContext context) async {
    final shouldDelete = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Delete item'),
          content:
              Text('Delete "${item.title}"? This action cannot be undone.'),
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
    final duplicate =
        ref.read(inventoryDuplicateServiceProvider).duplicate(item);
    Navigator.of(context).pop({'duplicated': duplicate});
  }

  void _moveNextStatus() {
    final next = ref.read(itemStatusTransitionProvider).moveNext(item);
    _updateItem(next);
  }

  void _movePreviousStatus() {
    final next = ref.read(itemStatusTransitionProvider).movePrevious(item);
    _updateItem(next);
  }

  void _setMarketPrice() {
    final next = ref.read(itemQuickRepriceProvider).toMarketAverage(item);
    _updateItem(next);
  }

  void _setMinus5() {
    final next = ref.read(itemQuickRepriceProvider).toMarketMinus5(item);
    _updateItem(next);
  }

  void _setMinus10() {
    final next = ref.read(itemQuickRepriceProvider).toMarketMinus10(item);
    _updateItem(next);
  }

  void _setPlus3() {
    final next = ref.read(itemQuickRepriceProvider).toMarketPlus3(item);
    _updateItem(next);
  }

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(appSettingsControllerProvider);
    final insights = ref.watch(itemDetailInsightsProvider).build(item);
    final timeline = ref.watch(itemTimelineServiceProvider).build(item);
    final lifecycle = ref.watch(itemLifecycleServiceProvider).build(item);
    final sale = SalesRepository().getByItemId(item.id);
    final marketSnapshots = MarketRepository().getByItemRef(item.id);
    final partoutProjects = PartOutRepository()
        .getAllProjects()
        .where((project) => project.sourceSetId == item.id)
        .toList();
    final nextStatus = ref.read(itemStatusTransitionProvider).next(item.status);
    final prevStatus =
        ref.read(itemStatusTransitionProvider).previous(item.status);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Item Details'),
        actions: [
          DetailsActionBar(
            onEdit: _openEdit,
            onDelete: () => _confirmDelete(context),
            onDuplicate: _duplicate,
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ItemDetailHeaderCard(item: item),
          const SizedBox(height: 16),
          ItemQuickDecisionBar(
            onSetMarket: _setMarketPrice,
            onMinus5: _setMinus5,
            onMoveNext: nextStatus == null ? () {} : _moveNextStatus,
            onMovePrevious: prevStatus == null ? () {} : _movePreviousStatus,
          ),
          const SizedBox(height: 16),
          const _SectionTitle('Lifecycle'),
          ItemLifecycleCard(steps: lifecycle),
          const SizedBox(height: 16),
          ItemStatusActionCard(
            onPrevious: prevStatus == null ? null : _movePreviousStatus,
            onNext: nextStatus == null ? null : _moveNextStatus,
          ),
          const SizedBox(height: 16),
          const _SectionTitle('Quick Reprice'),
          ItemQuickRepriceCard(
            onMarket: _setMarketPrice,
            onMinus5: _setMinus5,
            onMinus10: _setMinus10,
            onPlus3: _setPlus3,
          ),
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
          const _SectionTitle('Timeline'),
          if (timeline.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Text('No timeline events yet.'),
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
          const _SectionTitle('Overview'),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _infoRow('Title', item.title),
                  _infoRow('Type', item.type.name),
                  _infoRow('Theme', _formatNullable(item.theme)),
                  _infoRow('Subtheme', _formatNullable(item.subtheme)),
                  _infoRow('LEGO Number', _formatNullable(item.legoNumber)),
                  _infoRow('Minifig ID', _formatNullable(item.minifigId)),
                  _infoRow('Set ID', _formatNullable(item.setId)),
                  _infoRow('Condition', item.condition.name),
                  _infoRow('Completeness', item.completeness.name),
                  _infoRow('Quantity', item.quantity.toString()),
                  _infoRow(
                    'Purchase Date',
                    item.purchaseDate?.toIso8601String().split('T').first ?? '-',
                  ),
                  _infoRow(
                    'Sale Date',
                    item.saleDate?.toIso8601String().split('T').first ?? '-',
                  ),
                  _infoRow(
                    'Days In Inventory',
                    (item.daysInInventory ?? 0).toString(),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          const _SectionTitle('Financials'),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _infoRow(
                    'Purchase Price',
                    CurrencyFormatter.format(
                      item.purchasePrice,
                      currency: settings.baseCurrency,
                    ),
                  ),
                  _infoRow(
                    'Shipping To Me',
                    CurrencyFormatter.format(
                      item.shippingToMe,
                      currency: settings.baseCurrency,
                    ),
                  ),
                  _infoRow(
                    'Extra Costs',
                    CurrencyFormatter.format(
                      item.extraCosts,
                      currency: settings.baseCurrency,
                    ),
                  ),
                  _infoRow(
                    'Total Cost',
                    CurrencyFormatter.format(
                      item.totalCost,
                      currency: settings.baseCurrency,
                    ),
                  ),
                  _infoRow(
                    'Market Low',
                    item.marketLow == null
                        ? '-'
                        : CurrencyFormatter.format(
                            item.marketLow!,
                            currency: settings.baseCurrency,
                          ),
                  ),
                  _infoRow(
                    'Market Average',
                    item.marketAverage == null
                        ? '-'
                        : CurrencyFormatter.format(
                            item.marketAverage!,
                            currency: settings.baseCurrency,
                          ),
                  ),
                  _infoRow(
                    'Expected Sale Price',
                    item.expectedSalePrice == null
                        ? '-'
                        : CurrencyFormatter.format(
                            item.expectedSalePrice!,
                            currency: settings.baseCurrency,
                          ),
                  ),
                  _infoRow(
                    'Actual Sale Price',
                    item.actualSalePrice == null
                        ? '-'
                        : CurrencyFormatter.format(
                            item.actualSalePrice!,
                            currency: settings.baseCurrency,
                          ),
                  ),
                ],
              ),
            ),
          ),
          if (sale != null) ...[
            const SizedBox(height: 16),
            const _SectionTitle('Sale Record'),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _infoRow('Platform', sale.platform.name),
                    _infoRow('Buyer', _formatNullable(sale.buyerName)),
                    _infoRow(
                      'Sale Price',
                      CurrencyFormatter.format(
                        sale.salePrice,
                        currency: settings.baseCurrency,
                      ),
                    ),
                    _infoRow(
                      'Platform Fee',
                      CurrencyFormatter.format(
                        sale.platformFee,
                        currency: settings.baseCurrency,
                      ),
                    ),
                    _infoRow(
                      'Shipping By Me',
                      CurrencyFormatter.format(
                        sale.shippingPaidByMe,
                        currency: settings.baseCurrency,
                      ),
                    ),
                    _infoRow(
                      'Shipping By Buyer',
                      CurrencyFormatter.format(
                        sale.shippingPaidByBuyer,
                        currency: settings.baseCurrency,
                      ),
                    ),
                    _infoRow(
                      'Net Profit',
                      CurrencyFormatter.format(
                        sale.finalNet,
                        currency: settings.baseCurrency,
                      ),
                    ),
                    _infoRow(
                      'Sale Date',
                      sale.saleDate.toIso8601String().split('T').first,
                    ),
                  ],
                ),
              ),
            ),
          ],
          const SizedBox(height: 16),
          const _SectionTitle('Market History'),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: marketSnapshots.isEmpty
                  ? const Text('No market snapshots yet.')
                  : Column(
                      children: marketSnapshots
                          .map(
                            (snapshot) => Padding(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      '${snapshot.source} •\n${snapshot.capturedAt.toIso8601String().split('T').first}',
                                    ),
                                  ),
                                  Text(
                                    'L ${snapshot.lowPrice.toStringAsFixed(0)} / '
                                    'A ${snapshot.averagePrice.toStringAsFixed(0)} / '
                                    'H ${snapshot.highPrice.toStringAsFixed(0)}',
                                  ),
                                ],
                              ),
                            ),
                          )
                          .toList(),
                    ),
            ),
          ),
          if (partoutProjects.isNotEmpty) ...[
            const SizedBox(height: 16),
            const _SectionTitle('Part-out Links'),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: partoutProjects
                      .map(
                        (project) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          child: Row(
                            children: [
                              Expanded(child: Text(project.sourceSetTitle)),
                              Text(project.status.name),
                            ],
                          ),
                        ),
                      )
                      .toList(),
                ),
              ),
            ),
          ],
          const SizedBox(height: 16),
          const _SectionTitle('Platforms & Notes'),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _infoRow('Bought On', _formatNullable(item.platformBought)),
                  _infoRow('Sold On', _formatNullable(item.platformSold)),
                  _infoRow('Tracked', item.isTracked ? 'yes' : 'no'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          const _SectionTitle('Notes'),
          ItemDetailNotesCard(notes: item.notes),
          const SizedBox(height: 16),
          const _SectionTitle('Tags'),
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