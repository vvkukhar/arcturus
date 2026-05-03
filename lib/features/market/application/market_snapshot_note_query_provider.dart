import 'package:flutter_riverpod/flutter_riverpod.dart';

class MarketSnapshotNoteQueryNotifier extends Notifier<String> {
  @override
  String build() => '';

  void set(String value) {
    state = value;
  }
}

final marketSnapshotNoteQueryProvider =
    NotifierProvider<MarketSnapshotNoteQueryNotifier, String>(
  MarketSnapshotNoteQueryNotifier.new,
);