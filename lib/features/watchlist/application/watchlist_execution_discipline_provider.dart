import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_capital_discipline_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_execution_discipline_model.dart';

final watchlistExecutionDisciplineProvider =
    Provider<WatchlistExecutionDisciplineModel>((ref) {
  final capital = ref.watch(watchlistCapitalDisciplineProvider);

  double score = 0;
  if (capital.ratio <= 0.7) {
    score = 85;
  } else if (capital.ratio <= 1.0) {
    score = 68;
  } else if (capital.ratio <= 1.2) {
    score = 48;
  } else {
    score = 25;
  }

  final label = score >= 70
      ? 'strong execution discipline'
      : score >= 45
          ? 'moderate execution discipline'
          : 'weak execution discipline';

  return WatchlistExecutionDisciplineModel(
    score: score,
    label: label,
  );
});