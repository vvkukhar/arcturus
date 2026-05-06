import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/items/data/items_api_repository_provider.dart';
import 'package:lego_trading_manager/features/operator/data/operator_api_repository_provider.dart';
import 'package:lego_trading_manager/features/operator/presentation/widgets/unresolved_match_details_sheet.dart';

class OperatorUnresolvedMatchesScreen extends ConsumerStatefulWidget {
  const OperatorUnresolvedMatchesScreen({super.key});

  @override
  ConsumerState<OperatorUnresolvedMatchesScreen> createState() =>
      _OperatorUnresolvedMatchesScreenState();
}

class _OperatorUnresolvedMatchesScreenState
    extends ConsumerState<OperatorUnresolvedMatchesScreen> {
  late Future<List<Map<String, dynamic>>> _future;

  @override
  void initState() {
    super.initState();
    _future = ref.read(operatorApiRepositoryProvider).getUnresolvedMatches();
  }

  Future<void> _reload() async {
    setState(() {
      _future = ref.read(operatorApiRepositoryProvider).getUnresolvedMatches();
    });
    await _future;
  }

  Future<void> _openResolvePicker({
    required String queueId,
    required String titleRaw,
  }) async {
    final operatorRepository = ref.read(operatorApiRepositoryProvider);
    final itemsRepository = ref.read(itemsApiRepositoryProvider);
    final results = await itemsRepository.searchItems(titleRaw);
    final i18n = ref.read(i18nProvider.notifier);

    if (!mounted) {
      return;
    }

    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (sheetContext) {
        return SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Text(
                i18n.t('Select item'),
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 12),
              ...results.map(
                (candidate) => ListTile(
                  title: Text(candidate['title'] as String? ?? ''),
                  subtitle: Text(candidate['setNumber'] as String? ?? ''),
                  onTap: () async {
                    final messenger = ScaffoldMessenger.of(context);
                    final navigator = Navigator.of(sheetContext);

                    await operatorRepository.resolveMatch(
                      queueId: queueId,
                      itemId: candidate['id'] as String,
                      operatorNote: 'Resolved manually from app',
                    );

                    if (!mounted) {
                      return;
                    }

                    navigator.pop();
                    await _reload();

                    if (!mounted) {
                      return;
                    }

                    messenger.showSnackBar(
                      SnackBar(
                        content: Text(i18n.t('Match resolved')),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final operatorRepository = ref.watch(operatorApiRepositoryProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Unresolved Matches')),
      ),
      body: FutureBuilder<List<Map<String, dynamic>>>(
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
                  Center(child: Text(i18n.t('No unresolved matches'))),
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
                final titleRaw = item['titleRaw'] as String? ?? '';
                final queueId = item['id'] as String? ?? '';

                return Card(
                  child: ListTile(
                    title: Text(
                      titleRaw,
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                    subtitle: Text(
                      '${item['sourceCode'] ?? ''} • ${item['extractedSetNo'] ?? '-'}',
                    ),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () async {
                      await showModalBottomSheet<void>(
                        context: context,
                        isScrollControlled: true,
                        builder: (sheetContext) {
                          return UnresolvedMatchDetailsSheet(
                            item: item,
                            onResolve: () async {
                              Navigator.of(sheetContext).pop();
                              await _openResolvePicker(
                                queueId: queueId,
                                titleRaw: titleRaw,
                              );
                            },
                            onDismiss: () async {
                              final messenger = ScaffoldMessenger.of(context);
                              final navigator = Navigator.of(sheetContext);

                              await operatorRepository.dismissMatch(
                                queueId: queueId,
                                operatorNote: 'Dismissed from details sheet',
                              );

                              if (!mounted) {
                                return;
                              }

                              navigator.pop();
                              await _reload();

                              if (!mounted) {
                                return;
                              }

                              messenger.showSnackBar(
                                SnackBar(
                                  content: Text(i18n.t('Match dismissed')),
                                ),
                              );
                            },
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
    );
  }
}