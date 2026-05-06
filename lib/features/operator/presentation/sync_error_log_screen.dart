import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/operator/data/operator_api_repository_provider.dart';

class SyncErrorLogScreen extends ConsumerStatefulWidget {
  const SyncErrorLogScreen({super.key});

  @override
  ConsumerState<SyncErrorLogScreen> createState() => _SyncErrorLogScreenState();
}

class _SyncErrorLogScreenState extends ConsumerState<SyncErrorLogScreen> {
  late Future<List<Map<String, dynamic>>> _future;
  String? _selectedSourceCode;

  @override
  void initState() {
    super.initState();
    _future = ref.read(operatorApiRepositoryProvider).getSyncErrors();
  }

  Future<void> _reload() async {
    setState(() {
      _future = ref.read(operatorApiRepositoryProvider).getSyncErrors(
            sourceCode: _selectedSourceCode,
          );
    });
    await _future;
  }

  @override
  Widget build(BuildContext context) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Sync Error Log')),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: DropdownButtonFormField<String?>(
              value: _selectedSourceCode,
              decoration: InputDecoration(
                labelText: i18n.t('Filter by source'),
                border: const OutlineInputBorder(),
              ),
              items: [
                DropdownMenuItem<String?>(
                  value: null,
                  child: Text(i18n.t('All')),
                ),
                const DropdownMenuItem<String?>(
                  value: 'olx',
                  child: Text('OLX'),
                ),
                const DropdownMenuItem<String?>(
                  value: 'bricklink',
                  child: Text('BrickLink'),
                ),
              ],
              onChanged: (value) async {
                _selectedSourceCode = value;
                await _reload();
              },
            ),
          ),
          Expanded(
            child: FutureBuilder<List<Map<String, dynamic>>>(
              future: _future,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('${i18n.t('common.error', {'error': snapshot.error.toString()})}'));
                }
                final items = snapshot.data ?? [];
                if (items.isEmpty) {
                  return RefreshIndicator(
                    onRefresh: _reload,
                    child: ListView(
                      children: [
                        const SizedBox(height: 250),
                        Center(child: Text(i18n.t('No sync errors'))),
                      ],
                    ),
                  );
                }
                return RefreshIndicator(
                  onRefresh: _reload,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: items.length,
                    itemBuilder: (context, index) {
                      final item = items[index];
                      return Card(
                        child: ListTile(
                          title: Text(
                            item['message'] as String? ?? '',
                            style: const TextStyle(fontWeight: FontWeight.w800),
                          ),
                          subtitle: Text(
                            'Scope: ${item['scope'] ?? ''} • ${i18n.t('Source')}: ${item['sourceCode'] ?? '-'}',
                          ),
                          trailing: const Icon(Icons.chevron_right),
                          onTap: () async {
                            await showModalBottomSheet<void>(
                              context: context,
                              isScrollControlled: true,
                              builder: (context) {
                                return SafeArea(
                                  child: ListView(
                                    padding: const EdgeInsets.all(16),
                                    children: [
                                      Text(
                                        item['message'] as String? ?? '',
                                        style: const TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.w800,
                                        ),
                                      ),
                                      const SizedBox(height: 12),
                                      Text('Scope: ${item['scope'] ?? ''}'),
                                      Text(
                                          '${i18n.t('Source')}: ${item['sourceCode'] ?? '-'}'),
                                      Text(
                                          'Reference: ${item['referenceId'] ?? '-'}'),
                                      Text(
                                          'Created: ${item['createdAt'] ?? '-'}'),
                                      const SizedBox(height: 12),
                                      Text(
                                        'Details: ${item['detailsJson'] ?? '{}'}',
                                      ),
                                    ],
                                  ),
                                );
                              },
                            );
                          },
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}