import 'package:lego_trading_manager/core/validation/validation_error.dart';

class ValidationResult {
  final List<ValidationError> errors;

  const ValidationResult(this.errors);

  bool get isValid => errors.isEmpty;

  String? firstErrorFor(String field) {
    for (final error in errors) {
      if (error.field == field) return error.message;
    }
    return null;
  }

  static const ok = ValidationResult([]);
}
