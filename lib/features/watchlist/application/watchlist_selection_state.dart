class WatchlistSelectionState {
  final Set<String> selectedIds;

  const WatchlistSelectionState({
    required this.selectedIds,
  });

  factory WatchlistSelectionState.initial() {
    return const WatchlistSelectionState(selectedIds: {});
  }

  WatchlistSelectionState copyWith({
    Set<String>? selectedIds,
  }) {
    return WatchlistSelectionState(
      selectedIds: selectedIds ?? this.selectedIds,
    );
  }

  int get count => selectedIds.length;
  bool get isEmpty => selectedIds.isEmpty;
}