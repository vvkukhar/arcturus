class MarketSnapshotNoteModel {
  final String snapshotId;
  final String note;
  final DateTime createdAt;

  const MarketSnapshotNoteModel({
    required this.snapshotId,
    required this.note,
    required this.createdAt,
  });
}