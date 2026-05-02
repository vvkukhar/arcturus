class PurchaseValidationService {
  const PurchaseValidationService();

  String? validateRequiredText(String value, String fieldName) {
    if (value.trim().isEmpty) {
      return '$fieldName is required';
    }

    return null;
  }

  String? validatePositiveOrZero(String value, String fieldName) {
    final parsed = double.tryParse(value.trim().replaceAll(',', '.'));

    if (parsed == null) {
      return '$fieldName must be a number';
    }

    if (parsed < 0) {
      return '$fieldName cannot be negative';
    }

    return null;
  }

  String? validateCurrency(String value) {
    final text = value.trim().toUpperCase();

    if (text.length < 3 || text.length > 5) {
      return 'Currency code must be 3-5 characters';
    }

    return null;
  }
}