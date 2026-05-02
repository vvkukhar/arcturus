import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/bootstrap/app_reload_service.dart';
import 'package:lego_trading_manager/core/storage/app_data_backup_service_provider.dart';

class AppDataBackupCard extends ConsumerStatefulWidget {
  const AppDataBackupCard({super.key});

  @override
  ConsumerState<AppDataBackupCard> createState() => _AppDataBackupCardState();
}

class _AppDataBackupCardState extends ConsumerState<AppDataBackupCard> {
  final _importController = TextEditingController();
  bool _busy = false;

  @override
  void dispose() {
    _importController.dispose();
    super.dispose();
  }

  Future<void> _exportToClipboard() async {
    setState(() => _busy = true);

    try {
      final raw = await ref.read(appDataBackupServiceProvider).exportJsonString();
      await Clipboard.setData(ClipboardData(text: raw));

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Backup JSON copied to clipboard')),
      );
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Export failed: $error')),
      );
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _importFromText() async {
    final raw = _importController.text.trim();

    if (raw.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Paste backup JSON first')),
      );
      return;
    }

    setState(() => _busy = true);

    try {
      await ref.read(appDataBackupServiceProvider).importJsonString(raw);
      await ref.read(appReloadServiceProvider).reloadPersistentData();

      _importController.clear();

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Backup imported')),
      );
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Import failed: $error')),
      );
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _resetAll() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) {
        return AlertDialog(
          title: const Text('Reset all local data'),
          content: const Text(
            'This will delete purchases, sales, inventory allocations and sale-purchase links from local storage.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Reset'),
            ),
          ],
        );
      },
    );

    if (confirmed != true) return;

    setState(() => _busy = true);

    try {
      await ref.read(appDataBackupServiceProvider).resetAll();
      await ref.read(appReloadServiceProvider).reloadPersistentData();

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Local data reset')),
      );
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Reset failed: $error')),
      );
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Local Data Backup',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Export, import, or reset local purchases, sales, allocations and links.',
              style: TextStyle(color: Colors.white70),
            ),
            const SizedBox(height: 14),
            FilledButton.icon(
              onPressed: _busy ? null : _exportToClipboard,
              icon: const Icon(Icons.copy_outlined),
              label: const Text('Export JSON to Clipboard'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _importController,
              minLines: 4,
              maxLines: 8,
              decoration: const InputDecoration(
                labelText: 'Paste backup JSON',
                alignLabelWithHint: true,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: FilledButton.tonalIcon(
                    onPressed: _busy ? null : _importFromText,
                    icon: const Icon(Icons.upload_file_outlined),
                    label: const Text('Import'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _busy ? null : _resetAll,
                    icon: const Icon(Icons.delete_forever_outlined),
                    label: const Text('Reset'),
                  ),
                ),
              ],
            ),
            if (_busy) ...[
              const SizedBox(height: 12),
              const LinearProgressIndicator(),
            ],
          ],
        ),
      ),
    );
  }
}