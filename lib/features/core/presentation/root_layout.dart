import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/dashboard_live_screen.dart';
import 'package:lego_trading_manager/features/inventory/presentation/inventory_screen.dart';
import 'package:lego_trading_manager/features/command_center/presentation/command_center_screen.dart';
import 'package:lego_trading_manager/features/market/presentation/market_screen.dart';
import 'package:lego_trading_manager/features/settings/presentation/settings_hub_screen.dart';

class RootLayout extends ConsumerStatefulWidget {
  const RootLayout({super.key});

  @override
  ConsumerState<RootLayout> createState() => _RootLayoutState();
}

class _RootLayoutState extends ConsumerState<RootLayout> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    DashboardLiveScreen(),
    InventoryScreen(),
    CommandCenterScreen(),
    MarketScreen(),
    SettingsHubScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final i18n = ref.watch(i18nProvider.notifier);
    // Відслідковуємо зміну мови, щоб відразу перемалювати панель
    ref.watch(i18nProvider);

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        backgroundColor: const Color(0xFF0F1115),
        indicatorColor: Colors.blueAccent.withOpacity(0.2),
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.dashboard_outlined),
            selectedIcon: const Icon(Icons.dashboard, color: Colors.blueAccent),
            label: i18n.t('nav.home'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.inventory_2_outlined),
            selectedIcon: const Icon(Icons.inventory_2, color: Colors.blueAccent),
            label: i18n.t('nav.inventory'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.hub_outlined),
            selectedIcon: const Icon(Icons.hub, color: Colors.blueAccent),
            label: i18n.t('nav.cc'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.travel_explore_outlined),
            selectedIcon: const Icon(Icons.travel_explore, color: Colors.blueAccent),
            label: i18n.t('nav.market'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.settings_outlined),
            selectedIcon: const Icon(Icons.settings, color: Colors.blueAccent),
            label: i18n.t('nav.settings'),
          ),
        ],
      ),
    );
  }
}