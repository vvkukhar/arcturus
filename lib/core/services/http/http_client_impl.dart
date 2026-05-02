// lib/core/services/http/http_client_impl.dart

import 'package:http/http.dart' as http;
import 'package:lego_trading_manager/core/services/http/http_client_abstraction.dart';

class HttpClientImpl implements HttpClientAbstraction {
  @override
  Future<String> get(String url) async {
    final uri = Uri.parse(url);
    final response = await http.get(uri);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(
        'HTTP GET failed (${response.statusCode}) for $url',
      );
    }

    return response.body;
  }
}
