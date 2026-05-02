import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_bootstrap_usecase.dart';

final currencyBootstrapUsecaseProvider =
    Provider<CurrencyBootstrapUsecase>((ref) {
  return CurrencyBootstrapUsecase(ref);
});
