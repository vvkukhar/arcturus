import 'package:http/http.dart' as http;
import 'package:lego_trading_manager/core/services/http/http_client_abstraction.dart';

class HttpPackageClient implements HttpClientAbstraction {
  final http.Client _client;

  HttpPackageClient([http.Client? client]) : _client = client ?? http.Client();

  @override
  Future<String> get(String url) async {
    final response = await _client.get(Uri.parse(url));

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('HTTP GET failed: ${response.statusCode}');
    }

    return response.body;
  }
}
