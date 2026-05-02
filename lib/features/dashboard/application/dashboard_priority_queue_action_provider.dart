import 'package:flutter_riverpod/flutter_riverpod.dart';

class DashboardPriorityQueueActionState {
  final Set<String> doneIds;
  final Set<String> skippedIds;

  const DashboardPriorityQueueActionState({
    required this.doneIds,
    required this.skippedIds,
  });

  DashboardPriorityQueueActionState copyWith({
    Set<String>? doneIds,
    Set<String>? skippedIds,
  }) {
    return DashboardPriorityQueueActionState(
      doneIds: doneIds ?? this.doneIds,
      skippedIds: skippedIds ?? this.skippedIds,
    );
  }
}

class DashboardPriorityQueueActionController
    extends StateNotifier<DashboardPriorityQueueActionState> {
  DashboardPriorityQueueActionController()
      : super(
          const DashboardPriorityQueueActionState(
            doneIds: {},
            skippedIds: {},
          ),
        );

  void markDone(String id) {
    final nextDone = {...state.doneIds, id};
    final nextSkipped = {...state.skippedIds}..remove(id);
    state = state.copyWith(
      doneIds: nextDone,
      skippedIds: nextSkipped,
    );
  }

  void markSkipped(String id) {
    final nextSkipped = {...state.skippedIds, id};
    final nextDone = {...state.doneIds}..remove(id);
    state = state.copyWith(
      doneIds: nextDone,
      skippedIds: nextSkipped,
    );
  }

  void reset(String id) {
    final nextDone = {...state.doneIds}..remove(id);
    final nextSkipped = {...state.skippedIds}..remove(id);
    state = state.copyWith(
      doneIds: nextDone,
      skippedIds: nextSkipped,
    );
  }
}

final dashboardPriorityQueueActionProvider = StateNotifierProvider<
    DashboardPriorityQueueActionController, DashboardPriorityQueueActionState>(
  (ref) => DashboardPriorityQueueActionController(),
);
