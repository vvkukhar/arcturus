import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';

class SaleDuplicateService {
  const SaleDuplicateService();

  SaleModel duplicate(SaleModel source) {
    return source.copyWith(
      id: IdGenerator.next(),
      saleDate: DateTime.now(),
      note: [
        if ((source.note ?? '').trim().isNotEmpty) source.note!.trim(),
        'Duplicated from sale ${source.id}',
      ].join(' | '),
    );
  }
}