// lib/features/command_center/application/command_center_section_model.dart

import 'package:lego_trading_manager/features/command_center/application/command_center_action_model.dart';

class CommandCenterSectionModel {
  final String title;
  final List<CommandCenterActionModel> actions;

  const CommandCenterSectionModel({
    required this.title,
    required this.actions,
  });
}
