class SaleAllocationValidationModel {
  final bool isValid;
  final String label;
  final String? warning;

  const SaleAllocationValidationModel({
    required this.isValid,
    required this.label,
    this.warning,
  });
}