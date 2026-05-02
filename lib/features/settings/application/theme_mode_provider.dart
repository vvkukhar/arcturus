import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/app_theme_mode.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';

final materialThemeModeProvider = Provider<ThemeMode>((ref) {
  final mode = ref.watch(appSettingsControllerProvider).themeMode;

  switch (mode) {
    case AppThemeMode.dark:
      return ThemeMode.dark;
    case AppThemeMode.light:
      return ThemeMode.light;
    case AppThemeMode.system:
      return ThemeMode.system;
  }
});