// lib/core/utils/list_json_decoder.dart

import 'dart:convert';

class ListJsonDecoder {
  static List<dynamic> decode(String raw) {
    final decoded = jsonDecode(raw);
    if (decoded is List<dynamic>) return decoded;
    return const [];
  }
}
