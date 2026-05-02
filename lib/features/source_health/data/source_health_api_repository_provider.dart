import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'package:lego_trading_manager/features/source_health/data/source_health_api_repository.dart';

final sourceHealthApiRepositoryProvider =
    Provider<SourceHealthApiRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return SourceHealthApiRepository(apiClient);
});