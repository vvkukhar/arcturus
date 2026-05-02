import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/settings_quick_links_provider.dart';
import 'package:lego_trading_manager/features/settings/application/settings_sections_provider.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/settings_info_banner.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/settings_link_list.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/settings_nav_card.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/settings_section_title.dart';

class SettingsHubScreen extends ConsumerWidget {
  const SettingsHubScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sections = ref.watch(settingsSectionsProvider);
    final quickLinks = ref.watch(settingsQuickLinksProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings Hub'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const SettingsInfoBanner(
            title: 'System Control Center',
            subtitle:
                'Manage currency, fees, backup, restore, theme and local data.',
            icon: Icons.settings_suggest_outlined,
          ),
          const SizedBox(height: 16),
          const SettingsSectionTitle(text: 'Quick Links'),
          const SizedBox(height: 10),
          SettingsLinkList(items: quickLinks),
          const SizedBox(height: 20),
          const SettingsSectionTitle(text: 'All Sections'),
          const SizedBox(height: 10),
          ...sections.map(
            (item) => SettingsNavCard(
              title: item.title,
              subtitle: item.subtitle,
              onTap: () => Navigator.of(context).pushNamed(item.route),
            ),
          ),
        ],
      ),
    );
  }
}