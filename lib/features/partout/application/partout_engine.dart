import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';

class PartOutComputedProject {
  final PartOutProjectModel project;
  final List<PartOutLineModel> lines;
  final double expectedValue, actualValue;

  const PartOutComputedProject(this.project, this.lines, this.expectedValue, this.actualValue);
  
  double get expectedProfit => expectedValue - project.totalCost;
  double get actualProfit => actualValue - project.totalCost;
}

class PartOutEngineState {
  final List<PartOutComputedProject> projects;
  final String query;
  const PartOutEngineState({required this.projects, required this.query});
}

class PartOutEngine extends AsyncNotifier<PartOutEngineState> {
  @override
  Future<PartOutEngineState> build() async {
    final network = ref.read(networkCoreProvider);
    try {
      final pRes = await network.request('GET', '/partout/projects');
      final lRes = await network.request('GET', '/partout/lines');

      final pList = (pRes as List? ?? []).map((e) => PartOutProjectModel.fromMap(e)).toList();
      final lList = (lRes as List? ?? []).map((e) => PartOutLineModel.fromMap(e)).toList();

      return _computeState(pList, lList, '');
    } catch (e) {
      return const PartOutEngineState(projects: [], query: '');
    }
  }

  static PartOutEngineState _computeState(List<PartOutProjectModel> projList, List<PartOutLineModel> linesList, String query) {
    final map = <String, List<PartOutLineModel>>{};
    for (final line in linesList) {
      map.putIfAbsent(line.projectId, () => []).add(line);
    }

    final computed = <PartOutComputedProject>[];
    final q = query.trim().toLowerCase();

    for (final p in projList) {
      if (q.isNotEmpty && !p.sourceSetTitle.toLowerCase().contains(q)) continue;
      
      final pLines = map[p.id] ?? [];
      double exp = 0, act = 0;
      for (final l in pLines) { 
        exp += l.expectedTotalPrice; 
        act += l.actualTotalPrice; 
      }
      computed.add(PartOutComputedProject(p, pLines, exp, act));
    }

    return PartOutEngineState(projects: computed, query: query);
  }

  Future<void> saveProject(PartOutProjectModel project) async {
    final network = ref.read(networkCoreProvider);
    await network.request('POST', '/partout/projects', body: project.toMap());
    ref.invalidateSelf();
  }
  
  Future<void> saveLine(PartOutLineModel line) async {
    final network = ref.read(networkCoreProvider);
    await network.request('POST', '/partout/lines', body: line.toMap());
    ref.invalidateSelf();
  }

  void search(String query) async {
    final curr = state.valueOrNull;
    if (curr == null) return;
    state = const AsyncValue.loading();
    state = AsyncValue.data(_computeState(
      curr.projects.map((e) => e.project).toList(), 
      curr.projects.expand((e) => e.lines).toList(), 
      query
    ));
  }
}

final partOutEngineProvider = AsyncNotifierProvider<PartOutEngine, PartOutEngineState>(PartOutEngine.new);