import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/manual_action_report_model.dart';
import 'package:lego_trading_manager/features/settings/application/manual_action_report_provider.dart';
import 'package:lego_trading_manager/features/settings/application/manual_action_reports_query_provider.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/manual_action_report_card.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/manual_action_reports_search_field.dart';

class ManualActionReportsScreen extends ConsumerStatefulWidget {
  const ManualActionReportsScreen({super.key});

  @override
  ConsumerState<ManualActionReportsScreen> createState() =>
      _ManualActionReportsScreenState();
}

class _ManualActionReportsScreenState
    extends ConsumerState<ManualActionReportsScreen> {
  bool _loading = true;
  List<ManualActionReportModel> _reports = const [];
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.text = ref.read(manualActionReportsQueryProvider);
    Future.microtask(_load);
  }

  Future<void> _load() async {
    final data = await ref.read(manualActionReportProvider).getAll();
    if (!mounted) return;

    setState(() {
      _reports = data;
      _loading = false;
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final query =
        ref.watch(manualActionReportsQueryProvider).trim().toLowerCase();

    final visible = query.isEmpty
        ? _reports
        : _reports.where((e) {
            return e.title.toLowerCase().contains(query) ||
                e.note.toLowerCase().contains(query);
          }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Manual Action Reports'),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  ManualActionReportsSearchField(
                    controller: _searchController,
                    onChanged: (value) {
                      ref
                          .read(manualActionReportsQueryProvider.notifier)
                          .state = value;
                    },
                    onClear: () {
                      _searchController.clear();
                      ref
                          .read(manualActionReportsQueryProvider.notifier)
                          .state = '';
                    },
                  ),
                  const SizedBox(height: 12),
                  Expanded(
                    child: visible.isEmpty
                        ? const Center(
                            child: Text('No manual action reports yet.'),
                          )
                        : ListView.builder(
                            itemCount: visible.length,
                            itemBuilder: (context, index) {
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 10),
                                child: ManualActionReportCard(
                                  report: visible[index],
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