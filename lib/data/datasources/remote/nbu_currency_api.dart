// lib/data/datasources/remote/nbu_currency_api.dart

import 'dart:convert';
import 'package:http/http.dart' as http;

class NbuCurrencyApi {
  Future<List<Map<String, dynamic>>> fetchLatest() async {
    final uri = Uri.parse(
      'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json',
    );

    final response = await http.get(uri);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Failed to fetch NBU rates');
    }

    final decoded = jsonDecode(response.body) as List;

    return decoded.map((e) => Map<String, dynamic>.from(e as Map)).toList();
  }
}
