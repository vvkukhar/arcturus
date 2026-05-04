import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_provider.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_snapshot_notes_list.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_note_search_field.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_query_provider.dart';

class MarketNotesCenterScreen extends ConsumerStatefulWidget {
  const MarketNotesCenterScreen({super.key});

  @override
  ConsumerState<MarketNotesCenterScreen> createState() => _MarketNotesCenterScreenState();
}

class _MarketNotesCenterScreenState extends ConsumerState<MarketNotesCenterScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.text = ref.read(marketSnapshotNoteQueryProvider);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final notesAsync = ref.watch(marketVisibleSnapshotNotesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Market Notes Center'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            MarketNoteSearchField(
              controller: _searchController,
              onChanged: (value) {
                ref.read(marketSnapshotNoteQueryProvider.notifier).set(value);
              },
              onClear: () {
                _searchController.clear();
                ref.read(marketSnapshotNoteQueryProvider.notifier).set('');
              },
            ),
            const SizedBox(height: 16),
            Expanded(
              child: notesAsync.when(
                data: (notes) => MarketSnapshotNotesList(notes: notes),
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (err, stack) => Center(child: Text('Error: $err')),
              ),
            ),
          ],
        ),
      ),
    );
  }
}