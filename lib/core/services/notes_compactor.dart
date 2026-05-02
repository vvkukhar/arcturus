class NotesCompactor {
  static String compact(String value) {
    return value.trim().replaceAll(RegExp(r'\s+'), ' ');
  }
}
