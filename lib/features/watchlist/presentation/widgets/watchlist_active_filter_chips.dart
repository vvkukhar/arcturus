import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_filter_model.dart';

class WatchlistActiveFilterChips extends ConsumerWidget {
  final WatchlistFilterModel filter;

  const WatchlistActiveFilterChips({
    super.key,
    required this.filter,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final chips = <String>[];

    if ((filter.themeContains ?? '').trim().isNotEmpty) {
      chips.add('${i18n.t('theme')}: ${filter.themeContains}');
    }

    if (filter.activeOnly) chips.add(i18n.t('active only'));
    if (filter.targetHitOnly) chips.add(i18n.t('target hit only'));
    if (filter.underMaxOnly) chips.add(i18n.t('under max'));

    if (chips.isEmpty) return const SizedBox.shrink();

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: chips
          .map(
            (text) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: Colors.white10,
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(text),
            ),
          )
          .toList(),
    );
  }
}