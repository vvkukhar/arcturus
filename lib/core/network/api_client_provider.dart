import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client.dart';
import 'package:lego_trading_manager/core/network/auth_http_client.dart';

final authTokenProvider = Provider<Future<String?> Function()>((ref) {
  return () async => null;
});

final apiClientProvider = Provider<ApiClient>((ref) {
  final tokenProvider = ref.watch(authTokenProvider);
  final authHttpClient = AuthHttpClient(tokenProvider: tokenProvider);
  return ApiClient(authHttpClient);
});
