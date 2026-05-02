class ImportRestoreValidationService {
  String? validate(String raw) {
    final text = raw.trim();

    if (text.isEmpty) return 'Backup JSON is empty';
    if (!text.startsWith('{') && !text.startsWith('[')) {
      return 'Backup must be valid JSON text';
    }

    return null;
  }
}