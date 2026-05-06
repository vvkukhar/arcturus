import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_entry_model.dart';

class DeadStockCard extends ConsumerWidget {
  final DeadStockEntryModel entry;

  const DeadStockCard({
    super.key,
    required this.entry,
  });

  Color _color() {
    switch (entry.severity) {
      case 'critical':
        return Colors.red;
      case 'warning':
        return Colors.orange;
      default:
        return Colors.yellow;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final color = _color();
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        leading: Icon(Icons.warning_amber_rounded, color: color),
        title: Text(entry.title),
        subtitle: Text(
          '${entry.days} ${i18n.t('days')} • ${i18n.t('capital')} ${entry.capital.toStringAsFixed(2)}',
        ),
        trailing: Text(
          i18n.t(entry.severity),
          style: TextStyle(
            color: color,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
    );
  }
}