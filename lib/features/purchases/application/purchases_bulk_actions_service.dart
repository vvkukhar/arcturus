import 'package:lego_trading_manager/data/repositories/purchases_repository.dart';

class PurchasesBulkActionsService {
  final PurchasesRepository repository;

  const PurchasesBulkActionsService(this.repository);

  void deleteByIds(List<String> ids) {
    if (ids.isEmpty) return;

    for (final id in ids) {
      repository.deletePurchase(id);
    }
  }
}