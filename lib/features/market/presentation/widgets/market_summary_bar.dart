import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class MarketSummaryBar extends ConsumerWidget {
  final int visibleCount;
  final int totalCount;
  final String sortLabel;

  const MarketSummaryBar({
    super.key,
    required this.visibleCount,
    required this.totalCount,
    required this.sortLabel,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Row(
      children: [
        Expanded(
          child: Text(
            '${i18n.t('Visible')}: $visibleCount / ${i18n.t('Total')}: $totalCount',
            style: const TextStyle(
              fontWeight: FontWeight.w700,
              color: Colors.white70,
            ),
          ),
        ),
        Text(
          '${i18n.t('Sort')}: $sortLabel',
          style: const TextStyle(
            color: Colors.white60,
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}