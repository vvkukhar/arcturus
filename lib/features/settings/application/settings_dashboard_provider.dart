import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';
import 'package:lego_trading_manager/features/settings/application/settings_dashboard_entry_model.dart';

final settingsDashboardProvider =
    Provider<List<SettingsDashboardEntryModel>>((ref) {
  final settings = ref.watch(appSettingsControllerProvider);

  return [
    SettingsDashboardEntryModel(
      title: 'Base Currency',
      value: settings.baseCurrency,
      subtitle: 'main accounting currency',
    ),
    SettingsDashboardEntryModel(
      title: 'Official NBU',
      value: settings.useOfficialNbuRates ? 'enabled' : 'disabled',
      subtitle: 'rate source mode',
    ),
    SettingsDashboardEntryModel(
      title: 'Sale Fee %',
      value: settings.defaultSaleFeePercent.toStringAsFixed(2),
      subtitle: 'default sale fee',
    ),
    SettingsDashboardEntryModel(
      title: 'Purchase Shipping',
      value: settings.defaultPurchaseShipping.toStringAsFixed(2),
      subtitle: 'default buy shipping',
    ),
    SettingsDashboardEntryModel(
      title: 'Purchase Extra',
      value: settings.defaultPurchaseExtraCosts.toStringAsFixed(2),
      subtitle: 'default buy extra costs',
    ),
    SettingsDashboardEntryModel(
      title: 'Theme Mode',
      value: settings.themeMode.name,
      subtitle: 'app appearance',
    ),
  ];
});