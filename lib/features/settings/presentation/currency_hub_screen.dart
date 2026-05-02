import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/base_currency_card.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/currency_hub_nav_card.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/settings_currency_header_card.dart';

class CurrencyHubScreen extends ConsumerWidget {
  const CurrencyHubScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(appSettingsControllerProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Currency Hub')),
      drawer: const AppDrawer(),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          SettingsCurrencyHeaderCard(
            baseCurrency: settings.baseCurrency,
            useOfficialRates: settings.useOfficialNbuRates,
          ),
          const SizedBox(height: 12),
          BaseCurrencyCard(currency: settings.baseCurrency),
          const SizedBox(height: 12),
          CurrencyHubNavCard(
            title: 'Official Rates',
            subtitle: 'NBU sync and cached official rates',
            onTap: () =>
                Navigator.of(context).pushNamed(AppRouter.currencyRates),
          ),
          CurrencyHubNavCard(
            title: 'Converter',
            subtitle: 'Fast conversion with saved history',
            onTap: () =>
                Navigator.of(context).pushNamed(AppRouter.currencyConverter),
          ),
          CurrencyHubNavCard(
            title: 'Manual Rates',
            subtitle: 'Fallback and custom rate entries',
            onTap: () => Navigator.of(context).pushNamed(AppRouter.manualRates),
          ),
          CurrencyHubNavCard(
            title: 'Currency Settings',
            subtitle: 'Base currency and official/manual mode',
            onTap: () =>
                Navigator.of(context).pushNamed(AppRouter.currencySettings),
          ),
          CurrencyHubNavCard(
            title: 'Currency History',
            subtitle: 'Sync log + conversion history',
            onTap: () =>
                Navigator.of(context).pushNamed(AppRouter.currencyHistory),
          ),
          CurrencyHubNavCard(
            title: 'Default Fees',
            subtitle: 'Sale / purchase defaults',
            onTap: () => Navigator.of(context).pushNamed(AppRouter.defaultFees),
          ),
        ],
      ),
    );
  }
}