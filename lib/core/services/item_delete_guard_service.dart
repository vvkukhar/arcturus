import 'package:lego_trading_manager/data/repositories/purchases_repository.dart';
import 'package:lego_trading_manager/data/repositories/sales_repository.dart';

class ItemDeleteGuardService {
  final PurchasesRepository purchasesRepository;
  final SalesRepository salesRepository;

  ItemDeleteGuardService({
    required this.purchasesRepository,
    required this.salesRepository,
  });

  bool canDelete(String itemId) {
    final hasPurchases =
        purchasesRepository.getPurchasesByItemId(itemId).isNotEmpty;
    final hasSale = salesRepository.getByItemId(itemId) != null;
    return !hasPurchases && !hasSale;
  }
}
