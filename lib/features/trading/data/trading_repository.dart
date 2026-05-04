import 'dart:convert';
import 'package:http/http.dart' as http;

class TradingRepository {
  final String baseUrl;
  final String token;

  TradingRepository({required this.baseUrl, required this.token});

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      };

  Future<String> createCheckoutSession(String orderId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/payments/checkout/$orderId'),
      headers: _headers,
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return data['url'] as String;
    } else {
      throw Exception('Failed to initialize Monobank checkout');
    }
  }

  Future<List<dynamic>> getAiSuggestions() async {
    final response = await http.get(
      Uri.parse('$baseUrl/ai/suggestions'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    } else {
      throw Exception('Failed to fetch AI suggestions');
    }
  }

  Future<Map<String, dynamic>> explainDeal(Map<String, dynamic> params) async {
    final response = await http.post(
      Uri.parse('$baseUrl/ai/explain-deal'),
      headers: _headers,
      body: jsonEncode(params),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Failed to explain deal');
    }
  }
}