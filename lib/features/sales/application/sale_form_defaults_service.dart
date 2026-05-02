class SaleFormDefaultsService {
  const SaleFormDefaultsService();

  String defaultCurrency() => 'UAH';

  DateTime defaultSaleDate() {
    return DateTime.now();
  }

  String defaultPlatform() => '';
}