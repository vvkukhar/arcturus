class BackupHistoryEntryModel {
  final String id;
  final DateTime createdAt;
  final String fileName;
  final int recordCount;
  final String type;

  const BackupHistoryEntryModel({
    required this.id,
    required this.createdAt,
    required this.fileName,
    required this.recordCount,
    required this.type,
  });
}