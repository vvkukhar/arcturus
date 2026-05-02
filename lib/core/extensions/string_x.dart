extension StringX on String {
  String get normalizedQuery => trim().toLowerCase();

  bool get isBlank => trim().isEmpty;
}
