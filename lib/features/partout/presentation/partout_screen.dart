import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/widgets/empty_state_view.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';
import 'package:lego_trading_manager/features/partout/application/partout_controller.dart';
import 'package:lego_trading_manager/features/partout/application/partout_sort_option.dart';
import 'package:lego_trading_manager/features/partout/application/partout_summary_provider.dart';
import 'package:lego_trading_manager/features/partout/application/partout_ui_controller.dart';
import 'package:lego_trading_manager/features/partout/application/partout_visible_metrics_provider.dart';
import 'package:lego_trading_manager/features/partout/application/partout_visible_projects_provider.dart';
import 'package:lego_trading_manager/features/partout/presentation/add_partout_project_screen.dart';
import 'package:lego_trading_manager/features/partout/presentation/partout_project_details_screen.dart';
import 'package:lego_trading_manager/features/partout/presentation/widgets/partout_active_filter_chips.dart';
import 'package:lego_trading_manager/features/partout/presentation/widgets/partout_filter_sheet.dart';
import 'package:lego_trading_manager/features/partout/presentation/widgets/partout_project_card.dart';
import 'package:lego_trading_manager/features/partout/presentation/widgets/partout_search_field.dart';
import 'package:lego_trading_manager/features/partout/presentation/widgets/partout_sort_dropdown.dart';
import 'package:lego_trading_manager/features/partout/presentation/widgets/partout_summary_bar.dart';
import 'package:lego_trading_manager/features/partout/presentation/widgets/partout_summary_card.dart';
import 'package:lego_trading_manager/features/partout/presentation/widgets/partout_toolbar.dart';
import 'package:lego_trading_manager/features/partout/presentation/widgets/partout_visible_metrics_card.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';

class PartOutScreen extends ConsumerStatefulWidget {
  const PartOutScreen({super.key});

  @override
  ConsumerState<PartOutScreen> createState() => _PartOutScreenState();
}

class _PartOutScreenState extends ConsumerState<PartOutScreen> {
  final TextEditingController _searchController = TextEditingController();

  String _sortLabel(PartOutSortOption option) {
    switch (option) {
      case PartOutSortOption.newest:
        return 'Newest';
      case PartOutSortOption.oldest:
        return 'Oldest';
      case PartOutSortOption.titleAsc:
        return 'Title A-Z';
      case PartOutSortOption.titleDesc:
        return 'Title Z-A';
      case PartOutSortOption.costHighToLow:
        return 'Cost High-Low';
      case PartOutSortOption.expectedHighToLow:
        return 'Expected High-Low';
      case PartOutSortOption.actualHighToLow:
        return 'Actual High-Low';
      case PartOutSortOption.profitExpectedHighToLow:
        return 'Expected Profit';
      case PartOutSortOption.profitActualHighToLow:
        return 'Actual Profit';
    }
  }

  Future<void> _openAdd(BuildContext context, WidgetRef ref) async {
    final result = await Navigator.of(context).push<PartOutProjectModel>(
      MaterialPageRoute(
        builder: (_) => const AddPartOutProjectScreen(),
      ),
    );

    if (result == null) return;
    ref.read(partOutControllerProvider.notifier).addProject(result);
  }

  Future<void> _openProject(
    BuildContext context,
    PartOutProjectModel project,
  ) async {
    await Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => PartOutProjectDetailsScreen(project: project),
      ),
    );
  }

  Future<void> _openFilters() async {
    final state = ref.read(partOutUiControllerProvider);
    final result = await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => PartOutFilterSheet(initialFilter: state.filter),
    );

    if (result != null) {
      ref.read(partOutUiControllerProvider.notifier).setFilter(result);
    }
  }

  @override
  void initState() {
    super.initState();
    final state = ref.read(partOutUiControllerProvider);
    _searchController.text = state.query;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(partOutControllerProvider);
    final allProjects = state.projects;
    final visibleProjects = ref.watch(partOutVisibleProjectsProvider);
    final summary = ref.watch(partOutSummaryProvider);
    final visibleMetrics = ref.watch(partOutVisibleMetricsProvider);
    final currency = ref.watch(appSettingsControllerProvider).baseCurrency;
    final ui = ref.watch(partOutUiControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Part-out'),
      ),
      drawer: const AppDrawer(),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openAdd(context, ref),
        icon: const Icon(Icons.precision_manufacturing_outlined),
        label: const Text('Add Project'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: allProjects.isEmpty
            ? const EmptyStateView(
                title: 'No part-out projects yet',
                subtitle:
                    'Create a set breakdown project and track value line by line.',
              )
            : Column(
                children: [
                  PartOutSearchField(
                    controller: _searchController,
                    onChanged: (value) {
                      ref
                          .read(partOutUiControllerProvider.notifier)
                          .search(value);
                    },
                    onClear: () {
                      _searchController.clear();
                      ref.read(partOutUiControllerProvider.notifier).search('');
                    },
                  ),
                  const SizedBox(height: 12),
                  PartOutToolbar(
                    onOpenFilters: _openFilters,
                    sortDropdown: PartOutSortDropdown(
                      value: ui.sortOption,
                      onChanged: (value) {
                        if (value == null) return;
                        ref
                            .read(partOutUiControllerProvider.notifier)
                            .setSort(value);
                      },
                    ),
                  ),
                  const SizedBox(height: 12),
                  PartOutSummaryBar(
                    visibleCount: visibleProjects.length,
                    totalCount: allProjects.length,
                    sortLabel: _sortLabel(ui.sortOption),
                  ),
                  const SizedBox(height: 12),
                  PartOutActiveFilterChips(filter: ui.filter),
                  const SizedBox(height: 12),
                  PartOutSummaryCard(
                    summary: summary,
                    currency: currency,
                  ),
                  const SizedBox(height: 12),
                  PartOutVisibleMetricsCard(
                    metrics: visibleMetrics,
                    currency: currency,
                  ),
                  const SizedBox(height: 12),
                  Expanded(
                    child: visibleProjects.isEmpty
                        ? const Center(
                            child: Text('Nothing found for current filters.'),
                          )
                        : ListView.separated(
                            itemCount: visibleProjects.length,
                            separatorBuilder: (_, __) =>
                                const SizedBox(height: 10),
                            itemBuilder: (context, index) {
                              final project = visibleProjects[index];
                              return PartOutProjectCard(
                                project: project,
                                onTap: () => _openProject(context, project),
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