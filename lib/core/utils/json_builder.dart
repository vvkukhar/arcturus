// lib/core/utils/json_builder.dart

import 'dart:convert';

class JsonBuilder {
  static String build(Object value) {
    return const JsonEncoder.withIndent('  ').convert(value);
  }
}
