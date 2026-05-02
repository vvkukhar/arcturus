class ExportService {
  String exportCsv(List<Map<String, dynamic>> data) {
    final buffer = StringBuffer();

    if (data.isEmpty) return '';

    final headers = data.first.keys;
    buffer.writeln(headers.join(','));

    for (final row in data) {
      buffer.writeln(row.values.join(','));
    }

    return buffer.toString();
  }
}
