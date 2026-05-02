class AppValidator {
  static String? requiredText(String? value, {String label = 'Field'}) {
    if (value == null || value.trim().isEmpty) {
      return '$label is required';
    }
    return null;
  }

  static String? positiveNumber(String? value, {String label = 'Value'}) {
    final parsed = double.tryParse((value ?? '').replaceAll(',', '.'));
    if (parsed == null || parsed <= 0) {
      return '$label must be greater than 0';
    }
    return null;
  }

  static String? nonNegativeNumber(String? value, {String label = 'Value'}) {
    final parsed = double.tryParse((value ?? '').replaceAll(',', '.'));
    if (parsed == null || parsed < 0) {
      return '$label must be 0 or more';
    }
    return null;
  }
}
