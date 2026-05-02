import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/market_inventory_reprice_suggestion_model.dart';

class AnalyticsRepricePreviewTable extends StatelessWidget {
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
  Widget build(BuildContext context) {
    return Card(
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: DataTable(
          columns: const [
            DataColumn(label: Text('Pick')),
            DataColumn(label: Text('Item')),
            DataColumn(label: Text('Current')),
            DataColumn(label: Text('Market')),
            DataColumn(label: Text('Suggested')),
            DataColumn(label: Text('Action')),
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
                          child: const Text('Apply'),
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