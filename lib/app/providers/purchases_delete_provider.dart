import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_delete_service.dart';

final purchasesDeleteServiceProvider = Provider<PurchasesDeleteService>((ref) {
  return PurchasesDeleteService(ref.read(purchasesRepositoryProvider));
});
