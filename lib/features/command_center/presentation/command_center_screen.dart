import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_badge_provider.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_counters_provider.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_search_provider.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_visible_sections_provider.dart';
import 'package:lego_trading_manager/features/command_center/presentation/widgets/command_center_action_card.dart';
import 'package:lego_trading_manager/features/command_center/presentation/widgets/command_center_search_field.dart';

class CommandCenterScreen extends ConsumerStatefulWidget {
  const CommandCenterScreen({super.key});

  @override
  ConsumerState<CommandCenterScreen> createState() => _CommandCenterScreenState();
}

class _CommandCenterScreenState extends ConsumerState<CommandCenterScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.text = ref.read(commandCenterSearchProvider);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final sections = ref.watch(commandCenterVisibleSectionsProvider);
    final counters = ref.watch(commandCenterCountersProvider);
    final badgeService = ref.watch(commandCenterBadgeProvider);

    String? badgeFor(String route) {
      for (final item in counters) {
        if (item.route == route) {
          return badgeService.format(item.count);
        }
      }
      return null;
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Command Center'),
      ),
      drawer: const AppDrawer(),
      floatingActionButton: const GlobalQuickAddFab(),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          CommandCenterSearchField(
            controller: _searchController,
            onChanged: (value) {
              ref.read(commandCenterSearchProvider.notifier).set(value);
            },
            onClear: () {
              _searchController.clear();
              ref.read(commandCenterSearchProvider.notifier).set('');
            },
          ),
          const SizedBox(height: 16),
          ...sections.map(
            (section) => Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  section.title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 12),
                ...section.actions.map(
                  (action) => Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: CommandCenterActionCard(
                      action: action,
                      badgeText: badgeFor(action.route),
                      onTap: () => Navigator.of(context).pushNamed(action.route),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
              ],
            ),
          ),
        ],
      ),
    );
  }
}