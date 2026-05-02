// lib/core/utils/number_parser.dart

class NumberParser {
  static double parseDouble(String value) {
    return double.tryParse(value.replaceAll(',', '.').trim()) ?? 0.0;
  }

  static int parseInt(String value) {
    return int.tryParse(value.trim()) ?? 0;
  }
}
