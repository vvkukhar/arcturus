import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/market_inventory_reprice_suggestion_model.dart';

class AnalyticsRepricePreviewTable extends ConsumerWidget {
  final List<MarketInventoryRepriceSuggestionModel> items;
  final Set<String> selectedIds;
  final void Function(String id)? onToggle;
  final void Function(MarketInventoryRepriceSuggestionModel item)? onApply;

  const AnalyticsRepricePreviewTable({
    super.key,
    required this.items,
    this.selectedIds = const {},
    this.onToggle,
    this.onApply,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: DataTable(
          columns: [
            DataColumn(label: Text(i18n.t('Pick'))),
            DataColumn(label: Text(i18n.t('Item'))),
            DataColumn(label: Text(i18n.t('Current'))),
            DataColumn(label: Text(i18n.t('Market'))),
            DataColumn(label: Text(i18n.t('Suggested'))),
            DataColumn(label: Text(i18n.t('Action'))),
          ],
          rows: items.map((item) {
            return DataRow(
              selected: selectedIds.contains(item.itemId),
              cells: [
                DataCell(
                  Checkbox(
                    value: selectedIds.contains(item.itemId),
                    onChanged:
                        onToggle == null ? null : (_) => onToggle!(item.itemId),
                  ),
                ),
                DataCell(Text(item.title)),
                DataCell(Text(item.currentExpected.toStringAsFixed(2))),
                DataCell(Text(item.marketAverage.toStringAsFixed(2))),
                DataCell(Text(item.suggestedPrice.toStringAsFixed(2))),
                DataCell(
                  onApply == null
                      ? const Text('-')
                      : TextButton(
                          onPressed: () => onApply!(item),
                          child: Text(i18n.t('common.apply')),
                        ),
                ),
              ],
            );
          }).toList(),
        ),
      ),
    );
  }
}