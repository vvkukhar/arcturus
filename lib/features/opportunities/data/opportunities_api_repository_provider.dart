import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'package:lego_trading_manager/features/opportunities/data/opportunities_api_repository.dart';

final opportunitiesApiRepositoryProvider =
    Provider<OpportunitiesApiRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return OpportunitiesApiRepository(apiClient);
});
