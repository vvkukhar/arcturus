import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/deals/application/deal_history_provider.dart';
import 'package:lego_trading_manager/features/deals/application/deal_history_query_provider.dart';
import 'package:lego_trading_manager/features/deals/application/deal_history_entry_model.dart';
import 'package:lego_trading_manager/features/deals/presentation/widgets/deal_history_card.dart';
import 'package:lego_trading_manager/features/deals/presentation/widgets/deal_history_search_field.dart';

class DealHistoryScreen extends ConsumerStatefulWidget {
  const DealHistoryScreen({super.key});

  @override
  ConsumerState<DealHistoryScreen> createState() => _DealHistoryScreenState();
}

class _DealHistoryScreenState extends ConsumerState<DealHistoryScreen> {
  bool _loading = true;
  List<DealHistoryEntryModel> _entries = const [];
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.text = ref.read(dealHistoryQueryProvider);
    Future.microtask(_load);
  }

  Future<void> _load() async {
    final data = await ref.read(dealHistoryServiceProvider).getAll();
    if (!mounted) return;
    setState(() {
      _entries = data;
      _loading = false;
    });
  }

  Future<void> _clear() async {
    await ref.read(dealHistoryServiceProvider).clear();
    if (!mounted) return;
    setState(() {
      _entries = const [];
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Deal history cleared')),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final query = ref.watch(dealHistoryQueryProvider).trim().toLowerCase();
    final visible = query.isEmpty
        ? _entries
        : _entries.where((e) {
            return e.title.toLowerCase().contains(query) ||
                e.verdict.toLowerCase().contains(query);
          }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Deal History'),
        actions: [
          IconButton(
            onPressed: _entries.isEmpty ? null : _clear,
            icon: const Icon(Icons.delete_sweep_outlined),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  DealHistorySearchField(
                    controller: _searchController,
                    onChanged: (value) {
                      ref.read(dealHistoryQueryProvider.notifier).set(value);
                    },
                    onClear: () {
                      _searchController.clear();
                      ref.read(dealHistoryQueryProvider.notifier).set('');
                    },
                  ),
                  const SizedBox(height: 12),
                  Expanded(
                    child: visible.isEmpty
                        ? const Center(child: Text('No deal history yet.'))
                        : ListView.builder(
                            itemCount: visible.length,
                            itemBuilder: (context, index) {
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 10),
                                child: DealHistoryCard(entry: visible[index]),
                              );
                            },
                          ),
                  ),
                ],
              ),
            ),
    );
  }
}