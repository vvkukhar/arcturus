import 'package:lego_trading_manager/core/config/api_config.dart';
import 'package:lego_trading_manager/core/network/auth_http_client.dart';

class ApiClient {
  final AuthHttpClient _client;

  ApiClient(this._client);

  Uri _uri(String path) {
    return Uri.parse('${ApiConfig.baseUrl}$path');
  }

  Future<dynamic> get(String path) async {
    return _client.get(_uri(path));
  }

  Future<dynamic> post(String path, {Map<String, dynamic>? body}) async {
    return _client.post(_uri(path), body: body);
  }

  Future<dynamic> patch(String path, {Map<String, dynamic>? body}) async {
    return _client.patch(_uri(path), body: body);
  }
}
