import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/app_data_backup_card.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/app_data_health_card.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/app_data_integrity_card.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      drawer: const AppDrawer(),
      floatingActionButton: const GlobalQuickAddFab(),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          AppDataHealthCard(),
          const SizedBox(height: 12),
          AppDataIntegrityCard(),
          const SizedBox(height: 12),
          AppDataBackupCard(),
        ],
      ),
    );
  }
}