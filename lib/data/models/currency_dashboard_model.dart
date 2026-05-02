class CurrencyDashboardModel {
  final String baseCurrency;
  final int officialRateCount;
  final int manualRateCount;
  final DateTime? lastOfficialSync;
  final bool officialModeEnabled;

  const CurrencyDashboardModel({
    required this.baseCurrency,
    required this.officialRateCount,
    required this.manualRateCount,
    required this.lastOfficialSync,
    required this.officialModeEnabled,
  });
}
