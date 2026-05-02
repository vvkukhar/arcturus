class CurrencyHistoryEntryModel {
  final DateTime date;
  final String code;
  final double rate;

  const CurrencyHistoryEntryModel({
    required this.date,
    required this.code,
    required this.rate,
  });
}
