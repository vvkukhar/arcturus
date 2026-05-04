import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:lego_trading_manager/core/network/api_client.dart';
import 'package:lego_trading_manager/core/network/auth_http_client.dart';

final authTokenProvider = Provider<Future<String?> Function()>((ref) {
  return () async {
    final envToken = dotenv.env['AUTH_TOKEN'];
    if (envToken != null && envToken.trim().isNotEmpty) {
      return envToken.trim();
    }

    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  };
});

final apiClientProvider = Provider<ApiClient>((ref) {
  final tokenProvider = ref.watch(authTokenProvider);
  final authHttpClient = AuthHttpClient(tokenProvider: tokenProvider);
  return ApiClient(authHttpClient);
});