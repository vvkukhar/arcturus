import 'dart:convert';
import 'package:http/http.dart' as http;

typedef TokenProvider = Future<String?> Function();

class AuthHttpClient {
  final http.Client _client;
  final TokenProvider _tokenProvider;

  AuthHttpClient({
    required TokenProvider tokenProvider,
    http.Client? client,
  })  : _tokenProvider = tokenProvider,
        _client = client ?? http.Client();

  Future<dynamic> get(Uri uri) async {
    final token = await _tokenProvider();
    final response = await _client.get(
      uri,
      headers: _headers(token),
    );
    return _decode(response);
  }

  Future<dynamic> post(Uri uri, {Map<String, dynamic>? body}) async {
    final token = await _tokenProvider();
    final response = await _client.post(
      uri,
      headers: _headers(token),
      body: jsonEncode(body ?? {}),
    );
    return _decode(response);
  }

  Future<dynamic> patch(Uri uri, {Map<String, dynamic>? body}) async {
    final token = await _tokenProvider();
    final response = await _client.patch(
      uri,
      headers: _headers(token),
      body: jsonEncode(body ?? {}),
    );
    return _decode(response);
  }

  Map<String, String> _headers(String? token) {
    return {
      'Content-Type': 'application/json',
      if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
    };
  }

  dynamic _decode(http.Response response) {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(
          'Request failed: ${response.statusCode} ${response.body}');
    }
    if (response.body.isEmpty) {
      return null;
    }
    return jsonDecode(response.body);
  }
}
