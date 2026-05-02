// lib/core/services/http/default_http_client.dart

import 'package:http/http.dart' as http;
import 'package:lego_trading_manager/core/services/http/http_client_abstraction.dart';

class DefaultHttpClient implements HttpClientAbstraction {
  @override
  Future<String> get(String url) async {
    final response = await http.get(Uri.parse(url));

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('HTTP ${response.statusCode}: $url');
    }

    return response.body;
  }
}
