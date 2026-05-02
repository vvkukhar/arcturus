import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/services_providers.dart';
import 'package:lego_trading_manager/core/utils/import_service.dart';
import 'package:lego_trading_manager/features/settings/application/import_restore_validation_provider.dart';
import 'package:lego_trading_manager/features/settings/application/restore_dry_run_summary_provider.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/restore_dry_run_card.dart';

class ImportRestoreScreen extends ConsumerStatefulWidget {
  const ImportRestoreScreen({super.key});

  @override
  ConsumerState<ImportRestoreScreen> createState() =>
      _ImportRestoreScreenState();
}

class _ImportRestoreScreenState extends ConsumerState<ImportRestoreScreen> {
  final _controller = TextEditingController();
  bool _isLoading = false;

  Future<void> _restore() async {
    final validation = ref.read(importRestoreValidationProvider).validate(
          _controller.text,
        );

    if (validation != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(validation)),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final report = await ImportService.importFromJsonText(_controller.text);
      await ref.read(persistenceFlushServiceProvider).flush();

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Imported ${report.totalImported} records'),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Restore failed: $e')),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final summary =
        ref.read(restoreDryRunSummaryProvider).build(_controller.text);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Import Restore'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            RestoreDryRunCard(summary: summary),
            const SizedBox(height: 12),
            Expanded(
              child: TextField(
                controller: _controller,
                onChanged: (_) => setState(() {}),
                expands: true,
                minLines: null,
                maxLines: null,
                decoration: const InputDecoration(
                  labelText: 'Paste full backup JSON',
                  alignLabelWithHint: true,
                ),
              ),
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: _isLoading ? null : _restore,
              child: Text(_isLoading ? 'Restoring...' : 'Restore Backup'),
            ),
          ],
        ),
      ),
    );
  }
}