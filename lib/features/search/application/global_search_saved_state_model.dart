class GlobalSearchSavedStateModel {
  final List<String> recentQueries;
  final List<Map<String, String>> pinned;
  final String? defaultScope;

  const GlobalSearchSavedStateModel({
    required this.recentQueries,
    required this.pinned,
    required this.defaultScope,
  });
}
