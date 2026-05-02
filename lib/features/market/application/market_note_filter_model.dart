// lib/features/market/application/market_note_filter_model.dart
class MarketNoteFilterModel {
  final String? snapshotIdContains;
  final DateTime? from;
  final DateTime? to;

  const MarketNoteFilterModel({
    this.snapshotIdContains,
    this.from,
    this.to,
  });

  static const empty = MarketNoteFilterModel();

  MarketNoteFilterModel copyWith({
    String? snapshotIdContains,
    DateTime? from,
    DateTime? to,
    bool clearSnapshotIdContains = false,
    bool clearFrom = false,
    bool clearTo = false,
  }) {
    return MarketNoteFilterModel(
      snapshotIdContains: clearSnapshotIdContains
          ? null
          : (snapshotIdContains ?? this.snapshotIdContains),
      from: clearFrom ? null : (from ?? this.from),
      to: clearTo ? null : (to ?? this.to),
    );
  }
}
