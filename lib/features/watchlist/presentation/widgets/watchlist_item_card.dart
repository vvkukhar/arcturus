import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';

class WatchlistItemCard extends ConsumerWidget {
  final WatchlistItemModel item;
  final VoidCallback onTap;

  const WatchlistItemCard({
    super.key,
    required this.item,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currency = ref.watch(appSettingsControllerProvider).baseCurrency;

    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: onTap,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      item.title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: item.isActive
                          ? Colors.green.withValues(alpha: 0.15)
                          : Colors.grey.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      item.isActive ? 'active' : 'inactive',
                      style: TextStyle(
                        color: item.isActive ? Colors.green : Colors.grey,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text('${item.type.name} • ${item.theme ?? '-'}'),
              const SizedBox(height: 8),
              Wrap(
                spacing: 12,
                runSpacing: 8,
                children: [
                  Text(
                    'Desired: ${CurrencyFormatter.format(item.desiredBuyPrice, currency: currency, decimals: 0)}',
                  ),
                  Text(
                    'Max: ${CurrencyFormatter.format(item.maxBuyPrice, currency: currency, decimals: 0)}',
                  ),
                  Text(
                    'Market: ${CurrencyFormatter.format(item.marketPrice ?? 0, currency: currency, decimals: 0)}',
                  ),
                ],
              ),
              if ((item.comment ?? '').isNotEmpty) ...[
                const SizedBox(height: 8),
                Text(
                  item.comment!,
                  style: const TextStyle(color: Colors.white70),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}