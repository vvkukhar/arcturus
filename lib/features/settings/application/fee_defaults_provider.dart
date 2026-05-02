import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';
import 'package:lego_trading_manager/features/settings/application/fee_defaults_model.dart';

final feeDefaultsProvider = Provider<FeeDefaultsModel>((ref) {
  final settings = ref.watch(appSettingsControllerProvider);

  return FeeDefaultsModel(
    saleFeePercent: settings.defaultSaleFeePercent,
    shippingByMe: settings.defaultShippingPaidByMe,
    shippingByBuyer: settings.defaultShippingPaidByBuyer,
    purchaseShipping: settings.defaultPurchaseShipping,
    purchaseExtraCosts: settings.defaultPurchaseExtraCosts,
  );
});