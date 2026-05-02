import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'package:lego_trading_manager/features/inventory/data/inventory_api_repository.dart';

final inventoryApiRepositoryProvider = Provider<InventoryApiRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return InventoryApiRepository(apiClient);
});
