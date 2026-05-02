import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'package:lego_trading_manager/features/items/data/items_api_repository.dart';

final itemsApiRepositoryProvider = Provider<ItemsApiRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return ItemsApiRepository(apiClient);
});
