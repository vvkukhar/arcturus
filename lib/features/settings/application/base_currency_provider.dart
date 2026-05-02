import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';

final baseCurrencyProvider = Provider<String>((ref) {
  return ref.watch(appSettingsControllerProvider).baseCurrency;
});