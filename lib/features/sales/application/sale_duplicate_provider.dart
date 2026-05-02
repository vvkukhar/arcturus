import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sale_duplicate_service.dart';

final saleDuplicateProvider = Provider<SaleDuplicateService>((ref) {
  return const SaleDuplicateService();
});