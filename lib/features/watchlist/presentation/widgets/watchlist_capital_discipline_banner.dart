import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_capital_discipline_model.dart';

class WatchlistCapitalDisciplineBanner extends ConsumerWidget {
  final WatchlistCapitalDisciplineModel model;

  const WatchlistCapitalDisciplineBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final color = model.ratio <= 1 ? Colors.green : Colors.orange;
    final i18n = ref.watch(i18nProvider.notifier);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        '${i18n.t(model.label)} • ${model.ratio.toStringAsFixed(2)}',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}