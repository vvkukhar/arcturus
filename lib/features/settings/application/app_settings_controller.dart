import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/app_settings_repository_provider.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_model.dart';
import 'package:lego_trading_manager/features/settings/application/app_theme_mode.dart';

class AppSettingsController extends Notifier<AppSettingsModel> {
  @override
  AppSettingsModel build() {
    return AppSettingsModel.initial();
  }

  Future<void> load() async {
    state = await ref.read(appSettingsRepositoryProvider).load();
  }

  Future<void> update({
    String? baseCurrency,
    double? usdToUahRate,
    double? eurToUahRate,
    double? defaultSaleFeePercent,
    double? defaultShippingPaidByMe,
    double? defaultShippingPaidByBuyer,
    double? defaultPurchaseShipping,
    double? defaultPurchaseExtraCosts,
    bool? useOfficialNbuRates,
    AppThemeMode? themeMode,
    bool? autoBackupEnabled,
    int? autoBackupIntervalDays,
  }) async {
    final next = state.copyWith(
      baseCurrency: baseCurrency,
      usdToUahRate: usdToUahRate,
      eurToUahRate: eurToUahRate,
      defaultSaleFeePercent: defaultSaleFeePercent,
      defaultShippingPaidByMe: defaultShippingPaidByMe,
      defaultShippingPaidByBuyer: defaultShippingPaidByBuyer,
      defaultPurchaseShipping: defaultPurchaseShipping,
      defaultPurchaseExtraCosts: defaultPurchaseExtraCosts,
      useOfficialNbuRates: useOfficialNbuRates,
      themeMode: themeMode,
      autoBackupEnabled: autoBackupEnabled,
      autoBackupIntervalDays: autoBackupIntervalDays,
    );

    state = next;
    await ref.read(appSettingsRepositoryProvider).save(next);
  }
}

final appSettingsControllerProvider =
    NotifierProvider<AppSettingsController, AppSettingsModel>(
  AppSettingsController.new,
);