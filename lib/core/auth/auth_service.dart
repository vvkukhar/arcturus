import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  final String baseUrl;
  final http.Client _client;
  final FlutterSecureStorage _secureStorage;

  AuthService({required this.baseUrl, http.Client? client})
      : _client = client ?? http.Client(),
        _secureStorage = const FlutterSecureStorage();

  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await _client.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password, 'rememberMe': true}),
    );
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      final data = jsonDecode(res.body);
      await _secureStorage.write(key: 'arcturus_jwt', value: data['token']);
      return data['user'];
    }
    throw Exception('AUTH_FAILED');
  }

  Future<void> logout() async {
    final token = await getToken();
    if (token != null) {
      try {
        await _client.post(
          Uri.parse('$baseUrl/auth/logout'),
          headers: {'Authorization': 'Bearer $token'},
        );
      } catch (_) {}
    }
    await _secureStorage.delete(key: 'arcturus_jwt');
  }

  Future<String?> getToken() async => await _secureStorage.read(key: 'arcturus_jwt');
  
  Future<bool> isAuthenticated() async => await getToken() != null;
}