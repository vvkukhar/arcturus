class UrlGuardService {
  static bool looksLikeUrl(String value) {
    final text = value.trim().toLowerCase();
    return text.startsWith('http://') || text.startsWith('https://');
  }
}
