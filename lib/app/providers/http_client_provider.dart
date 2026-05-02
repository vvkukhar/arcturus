import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/services/http/http_client_abstraction.dart';
import 'package:lego_trading_manager/core/services/http/http_package_client.dart';

final httpClientProvider = Provider<HttpClientAbstraction>((ref) {
  return HttpPackageClient();
});
