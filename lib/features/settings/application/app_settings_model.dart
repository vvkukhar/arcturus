import 'package:lego_trading_manager/features/settings/application/app_theme_mode.dart';

class AppSettingsModel {
  final String baseCurrency;
  final double usdToUahRate;
  final double eurToUahRate;

  final double defaultSaleFeePercent;
  final double defaultShippingPaidByMe;
  final double defaultShippingPaidByBuyer;
  final double defaultPurchaseShipping;
  final double defaultPurchaseExtraCosts;

  final bool useOfficialNbuRates;
  final AppThemeMode themeMode;

  final bool autoBackupEnabled;
  final int autoBackupIntervalDays;

  const AppSettingsModel({
    required this.baseCurrency,
    required this.usdToUahRate,
    required this.eurToUahRate,
    required this.defaultSaleFeePercent,
    required this.defaultShippingPaidByMe,
    required this.defaultShippingPaidByBuyer,
    required this.defaultPurchaseShipping,
    required this.defaultPurchaseExtraCosts,
    required this.useOfficialNbuRates,
    required this.themeMode,
    required this.autoBackupEnabled,
    required this.autoBackupIntervalDays,
  });

  factory AppSettingsModel.initial() {
    return const AppSettingsModel(
      baseCurrency: 'UAH',
      usdToUahRate: 41.0,
      eurToUahRate: 45.0,
      defaultSaleFeePercent: 0.0,
      defaultShippingPaidByMe: 0.0,
      defaultShippingPaidByBuyer: 0.0,
      defaultPurchaseShipping: 0.0,
      defaultPurchaseExtraCosts: 0.0,
      useOfficialNbuRates: true,
      themeMode: AppThemeMode.dark,
      autoBackupEnabled: false,
      autoBackupIntervalDays: 7,
    );
  }

  AppSettingsModel copyWith({
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
  }) {
    return AppSettingsModel(
      baseCurrency: baseCurrency ?? this.baseCurrency,
      usdToUahRate: usdToUahRate ?? this.usdToUahRate,
      eurToUahRate: eurToUahRate ?? this.eurToUahRate,
      defaultSaleFeePercent:
          defaultSaleFeePercent ?? this.defaultSaleFeePercent,
      defaultShippingPaidByMe:
          defaultShippingPaidByMe ?? this.defaultShippingPaidByMe,
      defaultShippingPaidByBuyer:
          defaultShippingPaidByBuyer ?? this.defaultShippingPaidByBuyer,
      defaultPurchaseShipping:
          defaultPurchaseShipping ?? this.defaultPurchaseShipping,
      defaultPurchaseExtraCosts:
          defaultPurchaseExtraCosts ?? this.defaultPurchaseExtraCosts,
      useOfficialNbuRates: useOfficialNbuRates ?? this.useOfficialNbuRates,
      themeMode: themeMode ?? this.themeMode,
      autoBackupEnabled: autoBackupEnabled ?? this.autoBackupEnabled,
      autoBackupIntervalDays:
          autoBackupIntervalDays ?? this.autoBackupIntervalDays,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'baseCurrency': baseCurrency,
      'usdToUahRate': usdToUahRate,
      'eurToUahRate': eurToUahRate,
      'defaultSaleFeePercent': defaultSaleFeePercent,
      'defaultShippingPaidByMe': defaultShippingPaidByMe,
      'defaultShippingPaidByBuyer': defaultShippingPaidByBuyer,
      'defaultPurchaseShipping': defaultPurchaseShipping,
      'defaultPurchaseExtraCosts': defaultPurchaseExtraCosts,
      'useOfficialNbuRates': useOfficialNbuRates,
      'themeMode': themeMode.name,
      'autoBackupEnabled': autoBackupEnabled,
      'autoBackupIntervalDays': autoBackupIntervalDays,
    };
  }

  factory AppSettingsModel.fromMap(Map<String, dynamic> map) {
    return AppSettingsModel(
      baseCurrency: map['baseCurrency'] as String? ?? 'UAH',
      usdToUahRate: (map['usdToUahRate'] as num?)?.toDouble() ?? 41.0,
      eurToUahRate: (map['eurToUahRate'] as num?)?.toDouble() ?? 45.0,
      defaultSaleFeePercent:
          (map['defaultSaleFeePercent'] as num?)?.toDouble() ?? 0.0,
      defaultShippingPaidByMe:
          (map['defaultShippingPaidByMe'] as num?)?.toDouble() ?? 0.0,
      defaultShippingPaidByBuyer:
          (map['defaultShippingPaidByBuyer'] as num?)?.toDouble() ?? 0.0,
      defaultPurchaseShipping:
          (map['defaultPurchaseShipping'] as num?)?.toDouble() ?? 0.0,
      defaultPurchaseExtraCosts:
          (map['defaultPurchaseExtraCosts'] as num?)?.toDouble() ?? 0.0,
      useOfficialNbuRates: map['useOfficialNbuRates'] as bool? ?? true,
      themeMode: AppThemeMode.values.byName(
        map['themeMode'] as String? ?? AppThemeMode.dark.name,
      ),
      autoBackupEnabled: map['autoBackupEnabled'] as bool? ?? false,
      autoBackupIntervalDays: map['autoBackupIntervalDays'] as int? ?? 7,
    );
  }
}