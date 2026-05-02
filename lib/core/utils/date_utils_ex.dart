class DateUtilsEx {
  static String ymd(DateTime value) {
    return value.toIso8601String().split('T').first;
  }
}
