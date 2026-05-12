import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/features/settings/application/system_tools_engine.dart';

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