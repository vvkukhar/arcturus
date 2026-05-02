import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'package:lego_trading_manager/features/flows/data/flows_api_repository.dart';

final flowsApiRepositoryProvider = Provider<FlowsApiRepository>((ref) {
  final api = ref.watch(apiClientProvider);
  return FlowsApiRepository(api);
});
