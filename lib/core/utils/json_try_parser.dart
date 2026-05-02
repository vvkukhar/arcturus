import 'dart:convert';

class JsonTryParser {
  static Object? parse(String source) {
    try {
      return jsonDecode(source);
    } catch (_) {
      return null;
    }
  }
}
