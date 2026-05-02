class InventoryArchivedPresetModel {
  final String id;
  final String title;
  final bool showArchived;

  const InventoryArchivedPresetModel({
    required this.id,
    required this.title,
    required this.showArchived,
  });

  static const values = [
    InventoryArchivedPresetModel(
      id: 'active_only',
      title: 'Active only',
      showArchived: false,
    ),
    InventoryArchivedPresetModel(
      id: 'with_archived',
      title: 'With archived',
      showArchived: true,
    ),
  ];
}
