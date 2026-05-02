import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

class LocalJsonStorage {
  const LocalJsonStorage();

  Future<List<Map<String, dynamic>>> readList(String key) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(key);

    if (raw == null || raw.trim().isEmpty) {
      return const [];
    }

    final decoded = jsonDecode(raw);

    if (decoded is! List) {
      return const [];
    }

    return decoded
        .whereType<Map>()
        .map((item) => Map<String, dynamic>.from(item))
        .toList();
  }

  Future<void> writeList(
    String key,
    List<Map<String, dynamic>> values,
  ) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, jsonEncode(values));
  }

  Future<void> remove(String key) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(key);
  }

  Future<void> clearKeys(List<String> keys) async {
    final prefs = await SharedPreferences.getInstance();

    for (final key in keys) {
      await prefs.remove(key);
    }
  }
}