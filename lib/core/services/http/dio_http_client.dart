import 'package:http/http.dart' as http;
import 'package:lego_trading_manager/core/services/http/http_client_abstraction.dart';

class DioHttpClient implements HttpClientAbstraction {
  final http.Client client;

  DioHttpClient(this.client);

  @override
  Future<String> get(String url) async {
    final response = await client.get(Uri.parse(url));

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('HTTP ${response.statusCode}: $url');
    }

    return response.body;
  }
}
