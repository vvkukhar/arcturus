class SettingsValidationService {
  bool validCurrencyCode(String value) {
    final text = value.trim().toUpperCase();
    return text.length >= 3 && text.length <= 5;
  }
}