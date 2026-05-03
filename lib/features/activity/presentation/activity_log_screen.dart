import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_entry_model.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_filter_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_query_provider.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_log_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_log_search_field.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_log_type_dropdown.dart';

class ActivityLogScreen extends ConsumerStatefulWidget {
  const ActivityLogScreen({super.key});

  @override
  ConsumerState<ActivityLogScreen> createState() => _ActivityLogScreenState();
}

class _ActivityLogScreenState extends ConsumerState<ActivityLogScreen> {
  bool _loading = true;
  List<ActivityLogEntryModel> _entries = const [];
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.text = ref.read(activityLogQueryProvider);
    Future.microtask(_load);
  }

  Future<void> _load() async {
    final data = await ref.read(activityLogProvider).getAll();
    if (!mounted) return;

    setState(() {
      _entries = data;
      _loading = false;
    });
  }

  Future<void> _clear() async {
    await ref.read(activityLogProvider).clear();
    if (!mounted) return;

    setState(() {
      _entries = const [];
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Activity log cleared')),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final query = ref.watch(activityLogQueryProvider).trim().toLowerCase();
    final typeFilter = ref.watch(activityLogTypeFilterProvider);

    final visible = _entries.where((e) {
      final matchesQuery = query.isEmpty ||
          e.title.toLowerCase().contains(query) ||
          e.subtitle.toLowerCase().contains(query);

      final matchesType = typeFilter == null || e.type == typeFilter;
      return matchesQuery && matchesType;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Activity Log'),
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
                  ActivityLogSearchField(
                    controller: _searchController,
                    onChanged: (value) {
                      ref.read(activityLogQueryProvider.notifier).set(value);
                    },
                    onClear: () {
                      _searchController.clear();
                      ref.read(activityLogQueryProvider.notifier).set('');
                    },
                  ),
                  const SizedBox(height: 12),
                  ActivityLogTypeDropdown(
                    value: typeFilter,
                    onChanged: (value) {
                      ref.read(activityLogTypeFilterProvider.notifier).set(value);
                    },
                  ),
                  const SizedBox(height: 12),
                  Expanded(
                    child: visible.isEmpty
                        ? const Center(child: Text('No activity yet.'))
                        : ListView.builder(
                            itemCount: visible.length,
                            itemBuilder: (context, index) {
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 10),
                                child: ActivityLogCard(entry: visible[index]),
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