import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/system_tools_engine.dart';
import 'package:lego_trading_manager/app/providers/core_providers.dart';
import 'package:lego_trading_manager/core/enums/currency_code.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

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
  void _showMsg(String msg) {
    if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    final engine = ref.read(systemToolsEngineProvider.notifier);
    final currentCurrency = ref.watch(baseCurrencyProvider);
    final i18n = ref.watch(i18nProvider.notifier);
    final currentLocale = ref.watch(i18nProvider);

    ref.listen(systemToolsEngineProvider, (_, next) {
      if (next.value?.lastMessage != null) _showMsg(next.value!.lastMessage!);
    });

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('settings.hub'), style: const TextStyle(fontWeight: FontWeight.w900)),
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          // LANGUAGE SWITCHER
          Card(
            color: const Color(0xFF171A21),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.blueAccent.withValues(alpha: 0.3))), // ФІКС
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.language, color: Colors.blueAccent),
                      const SizedBox(width: 8),
                      Text(i18n.t('settings.language'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blueAccent)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    value: currentLocale,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.black12,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                    ),
                    items: [
                      DropdownMenuItem(value: 'en', child: Text(i18n.t('settings.lang.en'))),
                      DropdownMenuItem(value: 'uk', child: Text(i18n.t('settings.lang.uk'))),
                    ],
                    onChanged: (val) {
                      if (val != null) i18n.setLocale(val);
                    },
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // CURRENCY SWITCHER
          Card(
            color: const Color(0xFF171A21),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.amber.withValues(alpha: 0.3))), // ФІКС
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.currency_exchange, color: Colors.amberAccent),
                      const SizedBox(width: 8),
                      Text(i18n.t('settings.currency.title'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.amberAccent)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(i18n.t('settings.currency.sub'), style: const TextStyle(color: Colors.white70, fontSize: 13)),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    value: currentCurrency,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.black12,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                    ),
                    items: CurrencyCode.values.map((c) => DropdownMenuItem<String>(value: c.code, child: Text('${c.code} - ${c.label}'))).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        ref.read(sharedPreferencesProvider).setString('settings.base_currency', val);
                        ref.read(baseCurrencyProvider.notifier).state = val;
                      }
                    },
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // DATA MANAGEMENT (FILES)
          Card(
            color: const Color(0xFF171A21),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.greenAccent.withValues(alpha: 0.3))), // ФІКС
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.folder_zip, color: Colors.greenAccent),
                      SizedBox(width: 8),
                      Text('File Management', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.greenAccent)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  FilledButton.icon(
                    style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48), backgroundColor: Colors.blueAccent),
                    onPressed: () => engine.exportFullBackupFile(),
                    icon: const Icon(Icons.download),
                    label: const Text('Export Full Backup (.json)'),
                  ),
                  const SizedBox(height: 12),
                  FilledButton.icon(
                    style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48), backgroundColor: Colors.green),
                    onPressed: () => engine.exportInventoryCsv(),
                    icon: const Icon(Icons.table_chart),
                    label: const Text('Export Inventory (.csv)'),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(48), foregroundColor: Colors.orangeAccent, side: const BorderSide(color: Colors.orangeAccent)),
                    onPressed: () => engine.restoreFromFile(),
                    icon: const Icon(Icons.upload_file),
                    label: const Text('Restore Backup from File'),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // WIPE DATA SECTION
          _buildCard(
            i18n.t('settings.wipe.title'),
            i18n.t('settings.wipe.sub'),
            Icons.delete_forever,
            Colors.redAccent,
            () => _showWipeDialog(engine, i18n),
          ),
        ],
      ),
    );
  }

  void _showWipeDialog(SystemToolsEngine engine, dynamic i18n) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(i18n.t('settings.wipe.title')),
        content: Text(i18n.t('settings.wipe.sub')),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: Text(i18n.t('common.cancel'))),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () {
              engine.clearAllLocalData();
              Navigator.pop(ctx);
            },
            child: Text(i18n.t('settings.wipe.btn')),
          )
        ],
      ),
    );
  }

  Widget _buildCard(String title, String sub, IconData icon, Color color, VoidCallback onTap) {
    return Card(
      color: const Color(0xFF171A21),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: color.withValues(alpha: 0.3))), // ФІКС
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: CircleAvatar(backgroundColor: color.withValues(alpha: 0.1), child: Icon(icon, color: color)), // ФІКС
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        subtitle: Text(sub, style: const TextStyle(color: Colors.white70)),
        onTap: onTap,
      ),
    );
  }
}