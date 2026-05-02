import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sale_net_service.dart';

final saleNetProvider = Provider<SaleNetService>((ref) {
  return const SaleNetService();
});