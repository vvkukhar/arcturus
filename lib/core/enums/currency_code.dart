enum CurrencyCode {
  uah,
  usd,
  eur,
  gbp,
  pln,
  czk,
  cad,
}

extension CurrencyCodeX on CurrencyCode {
  String get code {
    switch (this) {
      case CurrencyCode.uah:
        return 'UAH';
      case CurrencyCode.usd:
        return 'USD';
      case CurrencyCode.eur:
        return 'EUR';
      case CurrencyCode.gbp:
        return 'GBP';
      case CurrencyCode.pln:
        return 'PLN';
      case CurrencyCode.czk:
        return 'CZK';
      case CurrencyCode.cad:
        return 'CAD';
    }
  }

  String get label {
    switch (this) {
      case CurrencyCode.uah:
        return 'Ukrainian Hryvnia';
      case CurrencyCode.usd:
        return 'US Dollar';
      case CurrencyCode.eur:
        return 'Euro';
      case CurrencyCode.gbp:
        return 'British Pound';
      case CurrencyCode.pln:
        return 'Polish Zloty';
      case CurrencyCode.czk:
        return 'Czech Koruna';
      case CurrencyCode.cad:
        return 'Canadian Dollar';
    }
  }

  static CurrencyCode fromCode(String value) {
    final normalized = value.trim().toUpperCase();

    return CurrencyCode.values.firstWhere(
      (item) => item.code == normalized,
      orElse: () => CurrencyCode.uah,
    );
  }
}
