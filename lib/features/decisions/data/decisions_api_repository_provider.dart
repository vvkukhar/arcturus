import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'package:lego_trading_manager/features/decisions/data/decisions_api_repository.dart';

final decisionsApiRepositoryProvider = Provider<DecisionsApiRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return DecisionsApiRepository(apiClient);
});
