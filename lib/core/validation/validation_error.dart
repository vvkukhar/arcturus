class ValidationError {
  final String field;
  final String message;

  const ValidationError({
    required this.field,
    required this.message,
  });
}
