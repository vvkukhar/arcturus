import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';

final saleStatusLabelProvider =
    Provider.family<String, SaleModel>((ref, sale) {
  final net = sale.finalNet;

  if (net >= 1000) return 'high profit';
  if (net >= 200) return 'normal';
  return 'low';
});