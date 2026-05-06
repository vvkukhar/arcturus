import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/deals/application/deal_history_entry_model.dart';

class DealHistoryCard extends ConsumerWidget {
  final DealHistoryEntryModel entry;

  const DealHistoryCard({
    super.key,
    required this.entry,
  });

  Color _color() {
    switch (entry.verdict) {
      case 'strong buy':
        return Colors.green;
      case 'good':
        return Colors.lightGreen;
      case 'weak':
        return Colors.orange;
      default:
        return Colors.red;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final color = _color();
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        title: Text(entry.title),
        subtitle: Text(
          '${i18n.t('ask')} ${entry.askingPrice.toStringAsFixed(2)} | '
          '${i18n.t('market')} ${entry.marketPrice.toStringAsFixed(2)} | '
          '${i18n.t('margin')} ${entry.marginPercent.toStringAsFixed(1)}%',
        ),
        trailing: Text(
          entry.verdict,
          style: TextStyle(
            color: color,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
    );
  }
}