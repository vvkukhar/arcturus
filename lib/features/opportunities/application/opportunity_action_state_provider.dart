import 'package:flutter_riverpod/flutter_riverpod.dart';

class OpportunityActionState {
  final Set<String> loadingIds;

  const OpportunityActionState({
    required this.loadingIds,
  });

  OpportunityActionState copyWith({
    Set<String>? loadingIds,
  }) {
    return OpportunityActionState(
      loadingIds: loadingIds ?? this.loadingIds,
    );
  }
}

class OpportunityActionNotifier extends Notifier<OpportunityActionState> {
  @override
  OpportunityActionState build() {
    return const OpportunityActionState(loadingIds: {});
  }

  void start(String id) {
    state = state.copyWith(loadingIds: {...state.loadingIds, id});
  }

  void stop(String id) {
    final updated = {...state.loadingIds}..remove(id);
    state = state.copyWith(loadingIds: updated);
  }

  bool isLoading(String id) => state.loadingIds.contains(id);
}

final opportunityActionProvider =
    NotifierProvider<OpportunityActionNotifier, OpportunityActionState>(
  OpportunityActionNotifier.new,
);