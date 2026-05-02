import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'planning_api_repository.dart';

final planningApiRepositoryProvider =
    Provider<PlanningApiRepository>((ref) {
  final api = ref.watch(apiClientProvider);
  return PlanningApiRepository(api);
});