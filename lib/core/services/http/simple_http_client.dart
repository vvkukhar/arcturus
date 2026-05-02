import 'package:http/http.dart' as http;
import 'package:lego_trading_manager/core/services/http/http_client_abstraction.dart';

class SimpleHttpClient implements HttpClientAbstraction {
  @override
  Future<String> get(String url) async {
    final uri = Uri.parse(url);
    final response = await http.get(uri);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('HTTP ${response.statusCode}: failed GET $url');
    }

    return response.body;
  }
}
