// lib/features/search/application/global_search_query_precision_model.dart

class GlobalSearchQueryPrecisionModel {
  final String label;
  final int queryLength;
  final int strongResults;

  const GlobalSearchQueryPrecisionModel({
    required this.label,
    required this.queryLength,
    required this.strongResults,
  });
}