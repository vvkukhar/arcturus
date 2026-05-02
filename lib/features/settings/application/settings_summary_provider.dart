import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';

final settingsSummaryProvider = Provider<Map<String, String>>((ref) {
  final settings = ref.watch(appSettingsControllerProvider);

  return {
    'baseCurrency': settings.baseCurrency,
    'saleFee': settings.defaultSaleFeePercent.toStringAsFixed(2),
    'purchaseShipping': settings.defaultPurchaseShipping.toStringAsFixed(2),
    'purchaseExtra': settings.defaultPurchaseExtraCosts.toStringAsFixed(2),
  };
});