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

class DashboardPriorityQueueActionController extends Notifier<DashboardPriorityQueueActionState> {
  @override
  DashboardPriorityQueueActionState build() {
    return const DashboardPriorityQueueActionState(doneIds: {}, skippedIds: {});
  }

  void markDone(String id) {
    state = state.copyWith(
      doneIds: {...state.doneIds, id},
      skippedIds: {...state.skippedIds}..remove(id),
    );
  }

  void markSkipped(String id) {
    state = state.copyWith(
      doneIds: {...state.doneIds}..remove(id),
      skippedIds: {...state.skippedIds, id},
    );
  }

  void reset(String id) {
    state = state.copyWith(
      doneIds: {...state.doneIds}..remove(id),
      skippedIds: {...state.skippedIds}..remove(id),
    );
  }
}

final dashboardPriorityQueueActionProvider = NotifierProvider<
    DashboardPriorityQueueActionController, DashboardPriorityQueueActionState>(
  DashboardPriorityQueueActionController.new,
);