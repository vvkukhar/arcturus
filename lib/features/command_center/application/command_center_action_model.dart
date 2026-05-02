// lib/features/command_center/application/command_center_action_model.dart

class CommandCenterActionModel {
  final String id;
  final String title;
  final String subtitle;
  final String route;

  const CommandCenterActionModel({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.route,
  });
}
