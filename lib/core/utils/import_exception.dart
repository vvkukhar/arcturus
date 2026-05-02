class ImportException implements Exception {
  final String message;

  const ImportException(this.message);

  @override
  String toString() => 'ImportException: $message';
}
