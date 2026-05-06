import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/core/widgets/details_action_bar.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_convert_flow_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_to_purchase_draft_provider.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/edit_watchlist_item_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/watchlist_purchase_draft_preview_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_convert_button.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_convert_result_snackbar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_to_purchase_button.dart';

class WatchlistItemDetailsScreen extends ConsumerStatefulWidget {
  final WatchlistItemModel item;

  const WatchlistItemDetailsScreen({
    super.key,
    required this.item,
  });

  @override
  ConsumerState<WatchlistItemDetailsScreen> createState() =>
      _WatchlistItemDetailsScreenState();
}

class _WatchlistItemDetailsScreenState
    extends ConsumerState<WatchlistItemDetailsScreen> {
  late WatchlistItemModel item;

  @override
  void initState() {
    super.initState();
    item = widget.item;
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
    final result = await Navigator.of(context).push<WatchlistItemModel>(
      MaterialPageRoute(
        builder: (_) => EditWatchlistItemScreen(item: item),
      ),
    );

    if (result == null) return;

    setState(() {
      item = result;
    });

    if (!mounted) return;
    Navigator.of(context).pop({'updated': result});
  }

  Future<void> _confirmDelete(I18nNotifier i18n) async {
    final shouldDelete = await showDialog<bool>(
      context: context,
      builder: (_) {
        return AlertDialog(
          title: Text(i18n.t('Delete watchlist item')),
          content: Text(i18n.t('Delete this watchlist item?')),
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

    if (shouldDelete == true && mounted) {
      Navigator.of(context).pop({
        'deleted': true,
        'id': item.id,
      });
    }
  }

  void _convertToInventory(I18nNotifier i18n) {
    final inventoryItem = ref.read(watchlistConvertFlowProvider).convert(item);
    ref.read(inventoryControllerProvider.notifier).addItem(inventoryItem);

    ScaffoldMessenger.of(context).showSnackBar(
      WatchlistConvertResultSnackBar.success(inventoryItem.title, i18n),
    );
  }

  void _openPurchaseDraft() {
    final draft = ref.read(watchlistToPurchaseDraftProvider).build(item);

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => WatchlistPurchaseDraftPreviewScreen(
          draft: draft,
          sourceItem: item,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(appSettingsControllerProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Watchlist Details')),
        actions: [
          DetailsActionBar(
            onEdit: _openEdit,
            onDelete: () => _confirmDelete(i18n),
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
                item.title,
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              WatchlistConvertButton(
                onPressed: () => _convertToInventory(i18n),
              ),
              WatchlistToPurchaseButton(
                onPressed: _openPurchaseDraft,
              ),
            ],
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _infoRow(i18n.t('Type'), i18n.t(item.type.name)),
                  _infoRow(i18n.t('Theme'), item.theme ?? '-'),
                  _infoRow(i18n.t('Reference ID'), item.refId ?? '-'),
                  _infoRow(
                    i18n.t('Desired Buy'),
                    CurrencyFormatter.format(
                      item.desiredBuyPrice,
                      currency: settings.baseCurrency,
                    ),
                  ),
                  _infoRow(
                    i18n.t('Max Buy'),
                    CurrencyFormatter.format(
                      item.maxBuyPrice,
                      currency: settings.baseCurrency,
                    ),
                  ),
                  _infoRow(
                    i18n.t('Market Price'),
                    item.marketPrice == null
                        ? '-'
                        : CurrencyFormatter.format(
                            item.marketPrice!,
                            currency: settings.baseCurrency,
                          ),
                  ),
                  _infoRow(i18n.t('Active'), item.isActive ? i18n.t('yes') : i18n.t('no')),
                  _infoRow(
                    i18n.t('Created At'),
                    item.createdAt.toIso8601String().split('T').first,
                  ),
                  _infoRow(i18n.t('Comment'), item.comment ?? '-'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}