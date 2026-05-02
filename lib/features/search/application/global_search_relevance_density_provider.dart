import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_provider.dart'
    as provider_file;
import 'package:lego_trading_manager/features/search/application/global_search_relevance_density_model.dart';

final globalSearchRelevanceDensityProvider =
    Provider<GlobalSearchRelevanceDensityModel>((ref) {
  final results = ref.watch(provider_file.globalSearchProvider);

  if (results.isEmpty) {
    return const GlobalSearchRelevanceDensityModel(
      ratio: 0,
      label: 'no relevance density',
    );
  }

  int goodOrBetter = 0;
  for (final item in results) {
    if (item.priorityScore >= 500) {
      goodOrBetter++;
    }
  }

  final ratio = goodOrBetter / results.length;
  final label = ratio >= 0.7
      ? 'high relevance density'
      : ratio >= 0.4
          ? 'moderate relevance density'
          : 'low relevance density';

  return GlobalSearchRelevanceDensityModel(
    ratio: ratio,
    label: label,
  );
});