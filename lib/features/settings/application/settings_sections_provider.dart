import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/features/settings/application/settings_section_item_model.dart';

final settingsSectionsProvider =
    Provider<List<SettingsSectionItemModel>>((ref) {
  return const [
    SettingsSectionItemModel(
      title: 'Currency Rates',
      subtitle: 'Load official NBU rates',
      route: AppRouter.currencyRates,
    ),
    SettingsSectionItemModel(
      title: 'Currency Converter',
      subtitle: 'Convert amount between currencies',
      route: AppRouter.currencyConverter,
    ),
    SettingsSectionItemModel(
      title: 'Manual Rates',
      subtitle: 'Emergency override / fallback',
      route: AppRouter.manualRates,
    ),
    SettingsSectionItemModel(
      title: 'Currency History',
      subtitle: 'Sync log + conversion history',
      route: AppRouter.currencyHistory,
    ),
    SettingsSectionItemModel(
      title: 'Default Fees',
      subtitle: 'Default sale/purchase fee presets',
      route: AppRouter.defaultFees,
    ),
    SettingsSectionItemModel(
      title: 'Export',
      subtitle: 'Export JSON / CSV backups',
      route: AppRouter.export,
    ),
    SettingsSectionItemModel(
      title: 'Import Restore',
      subtitle: 'Restore backup from JSON',
      route: AppRouter.importRestore,
    ),
    SettingsSectionItemModel(
      title: 'Backup Automation',
      subtitle: 'Backup schedule settings',
      route: AppRouter.backupAutomation,
    ),
    SettingsSectionItemModel(
      title: 'Theme',
      subtitle: 'Dark / light / system',
      route: AppRouter.themeSettings,
    ),
    SettingsSectionItemModel(
      title: 'Reset Data',
      subtitle: 'Clear all local data',
      route: AppRouter.resetData,
    ),
  ];
});