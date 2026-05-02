// lib/core/utils/list_json_encoder.dart

import 'dart:convert';

class ListJsonEncoder {
  static String encode(List<dynamic> data) {
    return jsonEncode(data);
  }
}
