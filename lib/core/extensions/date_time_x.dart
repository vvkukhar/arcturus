extension DateTimeX on DateTime {
  String get ymd => toIso8601String().split('T').first;
}
