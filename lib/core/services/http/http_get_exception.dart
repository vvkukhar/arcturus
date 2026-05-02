class HttpGetException implements Exception {
  final String message;

  const HttpGetException(this.message);

  @override
  String toString() => 'HttpGetException: $message';
}
