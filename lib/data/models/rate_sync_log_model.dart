// lib/data/models/rate_sync_log_model.dart

class RateSyncLogModel {
  final String id;
  final DateTime syncedAt;
  final int rateCount;
  final bool success;
  final String? note;

  const RateSyncLogModel({
    required this.id,
    required this.syncedAt,
    required this.rateCount,
    required this.success,
    this.note,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'syncedAt': syncedAt.toIso8601String(),
      'rateCount': rateCount,
      'success': success,
      'note': note,
    };
  }

  factory RateSyncLogModel.fromMap(Map<String, dynamic> map) {
    return RateSyncLogModel(
      id: map['id'] as String,
      syncedAt: DateTime.parse(map['syncedAt'] as String),
      rateCount: map['rateCount'] as int? ?? 0,
      success: map['success'] as bool? ?? false,
      note: map['note'] as String?,
    );
  }
}
