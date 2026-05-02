import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_provider.dart';

class GlobalSearchSharpnessRatioModel {
  final double ratio;
  final String label;

  const GlobalSearchSharpnessRatioModel({
    required this.ratio,
    required this.label,
  });
}

final globalSearchSharpnessRatioProvider =
    Provider<GlobalSearchSharpnessRatioModel>((ref) {
  final results = ref.watch(globalSearchProvider);
  if (results.isEmpty) {
    return const GlobalSearchSharpnessRatioModel(
      ratio: 0,
      label: 'no sharpness ratio',
    );
  }

  int exactOrStrong = 0;
  for (final item in results) {
    if (item.priorityScore >= 700) {
      exactOrStrong++;
    }
  }

  final ratio = exactOrStrong / results.length;
  final label = ratio >= 0.6
      ? 'sharp retrieval'
      : ratio >= 0.3
          ? 'mixed retrieval'
          : 'soft retrieval';

  return GlobalSearchSharpnessRatioModel(
    ratio: ratio,
    label: label,
  );
});
