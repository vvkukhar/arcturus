import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchaseDuplicateService {
  const PurchaseDuplicateService();

  PurchaseModel duplicate(PurchaseModel source) {
    return source.copyWith(
      id: IdGenerator.next(),
      purchaseDate: DateTime.now(),
      note: [
        if ((source.note ?? '').trim().isNotEmpty) source.note!.trim(),
        'Duplicated from purchase ${source.id}',
      ].join(' | '),
    );
  }
}