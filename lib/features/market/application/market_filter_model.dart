class MarketFilterModel {
  final String? sourceContains;
  final String? itemTitleContains;
  final bool positiveTrendOnly;
  final bool withUrlOnly;

  const MarketFilterModel({
    this.sourceContains,
    this.itemTitleContains,
    this.positiveTrendOnly = false,
    this.withUrlOnly = false,
  });

  static const empty = MarketFilterModel();

  bool get hasActiveFilters {
    return (sourceContains ?? '').trim().isNotEmpty ||
        (itemTitleContains ?? '').trim().isNotEmpty ||
        positiveTrendOnly ||
        withUrlOnly;
  }

  MarketFilterModel copyWith({
    String? sourceContains,
    String? itemTitleContains,
    bool? positiveTrendOnly,
    bool? withUrlOnly,
    bool clearSourceContains = false,
    bool clearItemTitleContains = false,
  }) {
    return MarketFilterModel(
      sourceContains:
          clearSourceContains ? null : (sourceContains ?? this.sourceContains),
      itemTitleContains: clearItemTitleContains
          ? null
          : (itemTitleContains ?? this.itemTitleContains),
      positiveTrendOnly: positiveTrendOnly ?? this.positiveTrendOnly,
      withUrlOnly: withUrlOnly ?? this.withUrlOnly,
    );
  }
}