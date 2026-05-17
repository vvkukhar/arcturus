import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  final String baseUrl;
  final http.Client _client;
  final _storage = const FlutterSecureStorage();

  AuthService({required this.baseUrl, http.Client? client})
      : _client = client ?? http.Client();

  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await _client.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password, 'rememberMe': true}),
    );
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      final data = jsonDecode(res.body);
      // ФІКС: Токен зберігаємо у безпечному сховищі
      await _storage.write(key: 'arcturus_jwt', value: data['token']);
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
    await _storage.delete(key: 'arcturus_jwt');
    
    // Чистимо звичайні налаштування сесії (якщо є)
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('arcturus_cookie');
  }

  Future<String?> getToken() async {
    return await _storage.read(key: 'arcturus_jwt');
  }
  
  Future<bool> isAuthenticated() async => await getToken() != null;
}