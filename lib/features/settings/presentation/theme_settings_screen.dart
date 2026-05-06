import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';
import 'package:lego_trading_manager/features/settings/application/app_theme_mode.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/settings_info_banner.dart';

class ThemeSettingsScreen extends ConsumerWidget {
  const ThemeSettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(appSettingsControllerProvider);
    final controller = ref.read(appSettingsControllerProvider.notifier);
    final i18n = ref.watch(i18nProvider.notifier);

    Widget tile(AppThemeMode mode, String title, String subtitle) {
      return Card(
        child: RadioListTile<AppThemeMode>(
          value: mode,
          groupValue: settings.themeMode,
          title: Text(i18n.t(title)),
          subtitle: Text(i18n.t(subtitle)),
          onChanged: (value) async {
            if (value == null) return;
            await controller.update(themeMode: value);
          },
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Theme Settings')),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          SettingsInfoBanner(
            title: 'App Theme',
            subtitle: 'Choose how the app should look on this device.',
            icon: Icons.palette_outlined,
          ),
          const SizedBox(height: 16),
          tile(AppThemeMode.dark, 'Dark', 'Default trading workspace mode'),
          tile(AppThemeMode.light, 'Light', 'Bright interface'),
          tile(AppThemeMode.system, 'System', 'Follow device preference'),
        ],
      ),
    );
  }
}