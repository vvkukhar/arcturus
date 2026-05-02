// lib/features/inventory/application/item_timeline_event_model.dart

class ItemTimelineEventModel {
  final String title;
  final String subtitle;
  final DateTime? date;
  final String type;

  const ItemTimelineEventModel({
    required this.title,
    required this.subtitle,
    required this.date,
    required this.type,
  });
}
