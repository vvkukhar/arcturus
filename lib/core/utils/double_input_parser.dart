class DoubleInputParser {
  static double parse(String value) {
    return double.tryParse(value.replaceAll(',', '.').trim()) ?? 0;
  }
}
