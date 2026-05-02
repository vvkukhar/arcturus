import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_signal_clarity_model.dart';

final globalSearchSignalClarityProvider =
    Provider<GlobalSearchSignalClarityModel>((ref) {
  final results = ref.watch(globalSearchProvider);
  int strong = 0;

  for (final item in results) {
    if (item.priorityScore >= 700) strong++;
  }

  final ratio = results.isEmpty ? 0 : strong / results.length;
  final label = results.isEmpty
      ? 'No search signal'
      : ratio >= 0.5
          ? 'Clear search signal'
          : ratio >= 0.25
              ? 'Mixed search signal'
              : 'Noisy search signal';

  return GlobalSearchSignalClarityModel(
    label: label,
    strongResults: strong,
    totalResults: results.length,
  );
});
