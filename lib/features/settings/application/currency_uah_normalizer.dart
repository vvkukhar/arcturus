class CurrencyUahNormalizer {
  static String normalize(String code) {
    final upper = code.trim().toUpperCase();
    if (upper == 'GRN') return 'UAH';
    return upper;
  }
}
