import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'package:lego_trading_manager/features/operator/data/operator_api_repository.dart';

final operatorApiRepositoryProvider = Provider<OperatorApiRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return OperatorApiRepository(apiClient);
});
