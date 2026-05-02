import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/market/application/market_note_filter_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_model.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_query_provider.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_note_filter_sheet.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_note_search_field.dart';

class MarketNotesCenterScreen extends ConsumerStatefulWidget {
  const MarketNotesCenterScreen({super.key});

  @override
  ConsumerState<MarketNotesCenterScreen> createState() =>
      _MarketNotesCenterScreenState();
}

class _MarketNotesCenterScreenState
    extends ConsumerState<MarketNotesCenterScreen> {
  bool _loading = true;
  List<MarketSnapshotNoteModel> _notes = const [];
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.text = ref.read(marketSnapshotNoteQueryProvider);
    Future.microtask(_load);
  }

  Future<void> _load() async {
    final data = await ref.read(marketSnapshotNoteProvider).getAll();
    if (!mounted) return;

    setState(() {
      _notes = data;
      _loading = false;
    });
  }

  Future<void> _openFilters() async {
    final initial = ref.read(marketNoteFilterProvider);
    final result = await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => MarketNoteFilterSheet(initialFilter: initial),
    );

    if (result != null) {
      ref.read(marketNoteFilterProvider.notifier).state = result;
    }
  }

  void _clearAll() {
    _searchController.clear();
    ref.read(marketSnapshotNoteQueryProvider.notifier).state = '';
    ref.read(marketNoteFilterProvider.notifier).state =
        MarketNoteFilterModel.empty;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final query =
        ref.watch(marketSnapshotNoteQueryProvider).trim().toLowerCase();
    final filter = ref.watch(marketNoteFilterProvider);

    final visible = _notes.where((note) {
      final matchesQuery = query.isEmpty ||
          note.note.toLowerCase().contains(query) ||
          note.snapshotId.toLowerCase().contains(query);

      final matchesSnapshot =
          (filter.snapshotIdContains ?? '').trim().isEmpty ||
              note.snapshotId
                  .toLowerCase()
                  .contains(filter.snapshotIdContains!.trim().toLowerCase());

      final matchesFrom =
          filter.from == null || !note.createdAt.isBefore(filter.from!);
      final matchesTo = filter.to == null || !note.createdAt.isAfter(filter.to!);

      return matchesQuery && matchesSnapshot && matchesFrom && matchesTo;
    }).toList();

    final hasFilters = query.isNotEmpty ||
        (filter.snapshotIdContains ?? '').trim().isNotEmpty ||
        filter.from != null ||
        filter.to != null;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Market Notes Center'),
        actions: [
          IconButton(
            onPressed: _openFilters,
            icon: const Icon(Icons.filter_alt_outlined),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  MarketNoteSearchField(
                    controller: _searchController,
                    onChanged: (value) {
                      ref.read(marketSnapshotNoteQueryProvider.notifier).state =
                          value;
                    },
                    onClear: () {
                      _searchController.clear();
                      ref.read(marketSnapshotNoteQueryProvider.notifier).state =
                          '';
                    },
                  ),
                  if (hasFilters) ...[
                    const SizedBox(height: 12),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: _clearAll,
                        child: const Text('Clear filters'),
                      ),
                    ),
                  ] else
                    const SizedBox(height: 12),
                  Expanded(
                    child: visible.isEmpty
                        ? const Center(child: Text('No market notes yet.'))
                        : ListView.builder(
                            itemCount: visible.length,
                            itemBuilder: (context, index) {
                              final note = visible[index];
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 10),
                                child: Card(
                                  child: ListTile(
                                    title: Text(note.note),
                                    subtitle:
                                        Text('snapshot: ${note.snapshotId}'),
                                    trailing: Text(
                                      note.createdAt
                                          .toIso8601String()
                                          .split('T')
                                          .first,
                                      style: const TextStyle(
                                        color: Colors.white70,
                                      ),
                                    ),
                                  ),
                                ),
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