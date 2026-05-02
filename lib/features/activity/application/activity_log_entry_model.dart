// lib/features/activity/application/activity_log_entry_model.dart
class ActivityLogEntryModel {
  final String title;
  final String subtitle;
  final DateTime createdAt;
  final String type;

  const ActivityLogEntryModel({
    required this.title,
    required this.subtitle,
    required this.createdAt,
    required this.type,
  });
}
