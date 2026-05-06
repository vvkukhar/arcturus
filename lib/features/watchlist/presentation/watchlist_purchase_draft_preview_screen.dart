import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_purchase_create_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_purchase_draft_model.dart';

class WatchlistPurchaseDraftPreviewScreen extends ConsumerWidget {
  final WatchlistPurchaseDraftModel draft;
  final WatchlistItemModel sourceItem;

  const WatchlistPurchaseDraftPreviewScreen({
    super.key,
    required this.draft,
    required this.sourceItem,
  });

  Widget _row(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 130,
            child: Text(
              label,
              style: const TextStyle(
                color: Colors.white70,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(appSettingsControllerProvider);
    final currency = settings.baseCurrency;
    final spread = draft.estimatedValue - draft.buyPrice;
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Purchase Draft Preview')),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                sourceItem.title,
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _row(i18n.t('Title'), draft.title),
                  _row(i18n.t('Quantity'), draft.quantity.toString()),
                  _row(
                    i18n.t('Buy Price'),
                    CurrencyFormatter.format(
                      draft.buyPrice,
                      currency: currency,
                    ),
                  ),
                  _row(
                    i18n.t('Estimated Value'),
                    CurrencyFormatter.format(
                      draft.estimatedValue,
                      currency: currency,
                    ),
                  ),
                  _row(
                    i18n.t('Potential Spread'),
                    CurrencyFormatter.format(
                      spread,
                      currency: currency,
                    ),
                  ),
                  _row(i18n.t('Theme'), draft.theme ?? '-'),
                  _row(i18n.t('Reference ID'), draft.refId ?? '-'),
                  _row(i18n.t('Source'), i18n.t('Watchlist')),
                  _row(i18n.t('Note'), draft.note ?? '-'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
          FilledButton.icon(
            onPressed: () {
              final result = ref.read(watchlistPurchaseCreateProvider).build(sourceItem);

              ref.read(inventoryControllerProvider.notifier).addItem(result.item);
              ref.read(purchasesControllerProvider.notifier).addPurchase(result.purchase);
              ref.read(watchlistControllerProvider.notifier).updateItem(
                    sourceItem.copyWith(isActive: false),
                  );

              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(i18n.t('Purchase created successfully')),
                ),
              );

              Navigator.of(context).pop();
            },
            icon: const Icon(Icons.check),
            label: Text(i18n.t('Confirm Purchase')),
          ),
        ],
      ),
    );
  }
}