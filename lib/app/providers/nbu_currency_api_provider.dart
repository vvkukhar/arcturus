// lib/app/providers/nbu_currency_api_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/datasources/remote/nbu_currency_api.dart';

final nbuCurrencyApiProvider = Provider<NbuCurrencyApi>((ref) {
  return NbuCurrencyApi();
});
