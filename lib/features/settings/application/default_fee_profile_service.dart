import 'package:lego_trading_manager/data/models/default_fee_profile_model.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_model.dart';

class DefaultFeeProfileService {
  DefaultFeeProfileModel fromSettings(AppSettingsModel settings) {
    return DefaultFeeProfileModel(
      saleFeePercent: settings.defaultSaleFeePercent,
      shippingPaidByMe: settings.defaultShippingPaidByMe,
      shippingPaidByBuyer: settings.defaultShippingPaidByBuyer,
      purchaseShipping: settings.defaultPurchaseShipping,
      purchaseExtraCosts: settings.defaultPurchaseExtraCosts,
    );
  }
}