import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_batch_buy_provider.dart';

class WatchlistBatchBuyPreviewScreen extends ConsumerWidget {
  final List<WatchlistItemModel> items;

  const WatchlistBatchBuyPreviewScreen({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final service = ref.watch(watchlistBatchBuyProvider);
    final settings = ref.watch(appSettingsControllerProvider);

    final totalCost = service.totalCost(items);
    final totalValue = service.totalEstimatedValue(items);
    final spread = totalValue - totalCost;

    return Scaffold(
      appBar: AppBar(title: const Text('Batch Buy Preview')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _row('Items', items.length.toString()),
                  _row(
                    'Total Cost',
                    CurrencyFormatter.format(totalCost,
                        currency: settings.baseCurrency),
                  ),
                  _row(
                    'Estimated Value',
                    CurrencyFormatter.format(totalValue,
                        currency: settings.baseCurrency),
                  ),
                  _row(
                    'Spread',
                    CurrencyFormatter.format(spread,
                        currency: settings.baseCurrency),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _row(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w800),
          ),
        ],
      ),
    );
  }
}