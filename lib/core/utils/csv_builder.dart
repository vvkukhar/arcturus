// lib/core/utils/csv_builder.dart

class CsvBuilder {
  static String build(List<List<String>> rows) {
    return rows.map(_encodeRow).join('\n');
  }

  static String _encodeRow(List<String> row) {
    return row.map(_escape).join(',');
  }

  static String _escape(String value) {
    final escaped = value.replaceAll('"', '""');
    final needsQuotes = escaped.contains(',') ||
        escaped.contains('"') ||
        escaped.contains('\n');
    return needsQuotes ? '"$escaped"' : escaped;
  }
}
