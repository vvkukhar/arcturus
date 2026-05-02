import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'package:lego_trading_manager/features/dashboard/data/dashboard_api_repository.dart';

final dashboardApiRepositoryProvider = Provider<DashboardApiRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return DashboardApiRepository(apiClient);
});
