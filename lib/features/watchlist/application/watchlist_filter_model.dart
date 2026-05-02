class WatchlistFilterModel {
  final bool activeOnly;
  final bool targetHitOnly;
  final bool underMaxOnly;
  final String? themeContains;

  const WatchlistFilterModel({
    this.activeOnly = false,
    this.targetHitOnly = false,
    this.underMaxOnly = false,
    this.themeContains,
  });

  static const empty = WatchlistFilterModel();

  Object? get type => null;
  bool get underDesiredOnly => targetHitOnly;
  bool get withMarketPriceOnly => false;

  bool get hasAnyFilter {
    return activeOnly ||
        targetHitOnly ||
        underMaxOnly ||
        (themeContains?.trim().isNotEmpty ?? false);
  }

  WatchlistFilterModel copyWith({
    bool? activeOnly,
    bool? targetHitOnly,
    bool? underMaxOnly,
    String? themeContains,
    bool clearThemeContains = false,
  }) {
    return WatchlistFilterModel(
      activeOnly: activeOnly ?? this.activeOnly,
      targetHitOnly: targetHitOnly ?? this.targetHitOnly,
      underMaxOnly: underMaxOnly ?? this.underMaxOnly,
      themeContains:
          clearThemeContains ? null : (themeContains ?? this.themeContains),
    );
  }
}