import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:lego_trading_manager/core/config/api_config.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService();
});

class AuthService {
  Future<bool> login(String masterToken) async {
    try {
      final url = Uri.parse('${ApiConfig.baseUrl}/auth/login');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'token': masterToken}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        final jwt = data['token'] as String?;

        if (jwt != null && jwt.isNotEmpty) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('auth_token', jwt);
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    
    try {
      final url = Uri.parse('${ApiConfig.baseUrl}/auth/logout');
      await http.post(url);
    } catch (_) {
      // Ігноруємо помилки мережі при логауті
    }
  }

  Future<bool> checkSession() async {
    final prefs = await SharedPreferences.getInstance();
    final localToken = prefs.getString('auth_token');
    
    if (localToken == null || localToken.isEmpty) return false;

    try {
      final url = Uri.parse('${ApiConfig.baseUrl}/auth/me');
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $localToken',
        },
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}