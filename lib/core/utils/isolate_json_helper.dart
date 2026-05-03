import 'dart:convert';
import 'package:flutter/foundation.dart';

/// Використовує фонові ізоляти (compute) для парсингу великих JSON.
/// Це гарантує, що головний UI-потік не буде фрізити (jank) при роботі з тисячами записів.
class IsolateJsonHelper {
  static Future<String> encode(Object data) {
    return compute(jsonEncode, data);
  }

  static Future<String> encodePretty(Object data) {
    return compute((obj) => const JsonEncoder.withIndent('  ').convert(obj), data);
  }

  static Future<dynamic> decode(String source) {
    return compute(jsonDecode, source);
  }
}