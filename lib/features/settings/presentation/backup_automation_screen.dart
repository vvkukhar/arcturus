import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/settings_info_banner.dart';

class BackupAutomationScreen extends ConsumerStatefulWidget {
  const BackupAutomationScreen({super.key});

  @override
  ConsumerState<BackupAutomationScreen> createState() =>
      _BackupAutomationScreenState();
}

class _BackupAutomationScreenState
    extends ConsumerState<BackupAutomationScreen> {
  late bool _enabled;
  late final TextEditingController _intervalController;

  int _parseInt(String value) {
    return int.tryParse(value) ?? 7;
  }

  @override
  void initState() {
    super.initState();
    final settings = ref.read(appSettingsControllerProvider);
    _enabled = settings.autoBackupEnabled;
    _intervalController =
        TextEditingController(text: settings.autoBackupIntervalDays.toString());
  }

  @override
  void dispose() {
    _intervalController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    await ref.read(appSettingsControllerProvider.notifier).update(
          autoBackupEnabled: _enabled,
          autoBackupIntervalDays: _parseInt(_intervalController.text),
        );

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Backup automation settings saved')),
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(appSettingsControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Backup Automation'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const SettingsInfoBanner(
            title: 'Auto Backup',
            subtitle:
                'This stores automation settings for scheduled backups inside the app.',
            icon: Icons.schedule,
          ),
          const SizedBox(height: 16),
          Card(
            child: SwitchListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16),
              title: const Text('Enable Auto Backup'),
              subtitle: const Text('Turn periodic backup on or off'),
              value: _enabled,
              onChanged: (value) {
                setState(() {
                  _enabled = value;
                });
              },
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: TextField(
                controller: _intervalController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Backup Interval (days)',
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: ListTile(
              title: const Text('Current saved state'),
              subtitle: Text(
                'enabled=${settings.autoBackupEnabled}, interval=${settings.autoBackupIntervalDays}d',
              ),
            ),
          ),
          const SizedBox(height: 20),
          FilledButton.icon(
            onPressed: _save,
            icon: const Icon(Icons.save_outlined),
            label: const Text('Save Automation'),
          ),
        ],
      ),
    );
  }
}