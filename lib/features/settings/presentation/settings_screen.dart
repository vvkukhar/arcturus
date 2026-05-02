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
    return const Scaffold(
      appBar: AppBar(
        title: Text('Settings'),
      ),
      drawer: AppDrawer(),
      floatingActionButton: GlobalQuickAddFab(),
      body: ListView(
        padding: EdgeInsets.all(16),
        children: [
          AppDataHealthCard(),
          SizedBox(height: 12),
          AppDataIntegrityCard(),
          SizedBox(height: 12),
          AppDataBackupCard(),
        ],
      ),
    );
  }
}