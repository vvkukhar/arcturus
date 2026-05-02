class SafeJsonListParser {
  const SafeJsonListParser();

  List<T> parseList<T>({
    required List<Map<String, dynamic>> rows,
    required T Function(Map<String, dynamic> json) fromJson,
    bool Function(T item)? isValid,
  }) {
    final result = <T>[];

    for (final row in rows) {
      try {
        final item = fromJson(row);

        if (isValid != null && !isValid(item)) {
          continue;
        }

        result.add(item);
      } catch (_) {
        continue;
      }
    }

    return result;
  }
}