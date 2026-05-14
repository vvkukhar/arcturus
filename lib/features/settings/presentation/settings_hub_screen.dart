import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/features/settings/application/system_tools_engine.dart';
import 'package:lego_trading_manager/app/providers/core_providers.dart';
import 'package:lego_trading_manager/core/enums/currency_code.dart';

// Глобальний провайдер для збереження та реактивного оновлення базової валюти системи
final baseCurrencyProvider = StateProvider<String>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return prefs.getString('settings.base_currency') ?? 'UAH';
});

class SettingsHubScreen extends ConsumerStatefulWidget {
  const SettingsHubScreen({super.key});

  @override
  ConsumerState<SettingsHubScreen> createState() => _SettingsHubScreenState();
}

class _SettingsHubScreenState extends ConsumerState<SettingsHubScreen> {
  final _importCtrl = TextEditingController();

  void _showMsg(String msg) {
    if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    final engine = ref.read(systemToolsEngineProvider.notifier);
    final currentCurrency = ref.watch(baseCurrencyProvider);

    ref.listen(systemToolsEngineProvider, (_, next) {
      if (next.value?.lastMessage != null) _showMsg(next.value!.lastMessage!);
    });

    return Scaffold(
      appBar: AppBar(title: const Text('System Control Center', style: TextStyle(fontWeight: FontWeight.w900))),
      drawer: const AppDrawer(),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          // CURRENCY SWITCHER SECTION (STAGE 3)
          Card(
            color: const Color(0xFF171A21),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: BorderSide(color: Colors.amber.withValues(alpha: 0.3)), // ВИПРАВЛЕНО ТУТ
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.currency_exchange, color: Colors.amberAccent),
                      SizedBox(width: 8),
                      Text('Global System Currency', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.amberAccent)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Select the primary currency for Arcturus operations. Financial metrics, open profits, and automated valuation models will dynamically convert into this unit.',
                    style: TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    value: currentCurrency,
                    decoration: InputDecoration(
                      labelText: 'Base Operations Currency',
                      filled: true,
                      fillColor: Colors.black12,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                    ),
                    items: CurrencyCode.values.map((c) {
                      return DropdownMenuItem<String>(
                        value: c.code,
                        child: Text('${c.code} - ${c.label}'),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        ref.read(sharedPreferencesProvider).setString('settings.base_currency', val);
                        ref.read(baseCurrencyProvider.notifier).state = val;
                        _showMsg('System base currency updated to $val');
                      }
                    },
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // BACKUP SECTION
          _buildCard(
            'Backup & Export',
            'Export entire system state to clipboard JSON.',
            Icons.save,
            Colors.blueAccent,
            () async {
              final json = await engine.createFullBackupJson();
              if (json.isNotEmpty) {
                await Clipboard.setData(ClipboardData(text: json));
                _showMsg('Copied to clipboard');
              }
            },
          ),
          const SizedBox(height: 16),

          // RESTORE SECTION
          Card(
            color: const Color(0xFF171A21),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Restore System', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.greenAccent)),
                  const SizedBox(height: 8),
                  const Text('Paste JSON backup string here. This overrides existing memory.', style: TextStyle(color: Colors.white70)),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _importCtrl,
                    maxLines: 4,
                    decoration: InputDecoration(
                      hintText: '{"inventory": [...]}',
                      filled: true,
                      fillColor: Colors.black12,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                    ),
                  ),
                  const SizedBox(height: 12),
                  FilledButton.icon(
                    onPressed: () => engine.restoreFromJson(_importCtrl.text),
                    icon: const Icon(Icons.restore),
                    label: const Text('Restore Data'),
                  )
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // WIPE DATA SECTION
          _buildCard(
            'Danger Zone',
            'Clear all local storages. Irreversible action.',
            Icons.delete_forever,
            Colors.redAccent,
            () => _showWipeDialog(engine),
          ),
        ],
      ),
    );
  }

  void _showWipeDialog(SystemToolsEngine engine) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Wipe System?'),
        content: const Text('This will delete all inventory, purchases, sales, and caching.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () {
              engine.clearAllLocalData();
              Navigator.pop(ctx);
            },
            child: const Text('Wipe Now'),
          )
        ],
      ),
    );
  }

  Widget _buildCard(String title, String sub, IconData icon, Color color, VoidCallback onTap) {
    return Card(
      color: const Color(0xFF171A21),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: color.withValues(alpha: 0.3))),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: CircleAvatar(backgroundColor: color.withValues(alpha: 0.1), child: Icon(icon, color: color)),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        subtitle: Text(sub, style: const TextStyle(color: Colors.white70)),
        onTap: onTap,
      ),
    );
  }
}