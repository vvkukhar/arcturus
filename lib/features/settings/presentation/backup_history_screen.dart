import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/backup_history_service.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/backup_history_card.dart';

class BackupHistoryScreen extends ConsumerStatefulWidget {
  const BackupHistoryScreen({super.key});

  @override
  ConsumerState<BackupHistoryScreen> createState() =>
      _BackupHistoryScreenState();
}

class _BackupHistoryScreenState extends ConsumerState<BackupHistoryScreen> {
  bool _loading = true;
  List<dynamic> _entries = const [];

  @override
  void initState() {
    super.initState();
    Future.microtask(_load);
  }

  Future<void> _load() async {
    final data = await ref.read(backupHistoryServiceProvider).getAll();
    if (!mounted) return;

    setState(() {
      _entries = data;
      _loading = false;
    });
  }

  Future<void> _clear() async {
    await ref.read(backupHistoryServiceProvider).clear();
    if (!mounted) return;

    setState(() {
      _entries = const [];
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Backup history cleared')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Backup History'),
        actions: [
          IconButton(
            onPressed: _entries.isEmpty ? null : _clear,
            icon: const Icon(Icons.delete_sweep_outlined),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _entries.isEmpty
              ? const Center(child: Text('No backup history yet.'))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _entries.length,
                  itemBuilder: (context, index) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: BackupHistoryCard(entry: _entries[index]),
                    );
                  },
                ),
    );
  }
}