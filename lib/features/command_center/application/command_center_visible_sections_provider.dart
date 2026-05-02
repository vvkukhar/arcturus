import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_search_provider.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_section_model.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_sections_provider.dart';

final commandCenterVisibleSectionsProvider =
    Provider<List<CommandCenterSectionModel>>((ref) {
  final sections = ref.watch(commandCenterSectionsProvider);
  final query = ref.watch(commandCenterSearchProvider).trim().toLowerCase();

  if (query.isEmpty) {
    return sections;
  }

  final result = <CommandCenterSectionModel>[];

  for (final section in sections) {
    final filteredActions = section.actions.where((action) {
      return action.title.toLowerCase().contains(query) ||
          action.subtitle.toLowerCase().contains(query);
    }).toList();

    if (filteredActions.isNotEmpty) {
      result.add(
        CommandCenterSectionModel(
          title: section.title,
          actions: filteredActions,
        ),
      );
    }
  }

  return result;
});