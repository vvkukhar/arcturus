class GlobalSearchScopeBoostService {
  const GlobalSearchScopeBoostService();

  int boost({
    required String? selectedScope,
    required String itemType,
  }) {
    if (selectedScope == null) return 0;
    if (selectedScope == itemType) return 300;
    return 0;
  }
}
