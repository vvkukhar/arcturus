class GlobalSearchFuzzyService {
  const GlobalSearchFuzzyService();

  int score({
    required String query,
    required String text,
  }) {
    final q = query.trim().toLowerCase();
    final t = text.trim().toLowerCase();
    if (q.isEmpty || t.isEmpty) return 0;
    if (t == q) return 1000;
    if (t.startsWith(q)) return 800;
    if (t.contains(q)) return 600;
    int sequential = 0;
    int lastIndex = -1;
    for (final rune in q.runes) {
      final char = String.fromCharCode(rune);
      final idx = t.indexOf(char, lastIndex + 1);
      if (idx != -1) {
        sequential += 20;
        lastIndex = idx;
      }
    }
    return sequential;
  }
}
