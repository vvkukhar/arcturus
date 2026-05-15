import 'dart:convert';
import 'dart:isolate';
import 'package:flutter/foundation.dart'; // Додано
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

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
  static const _pKey = 'arcturus_partout_projects';
  static const _lKey = 'arcturus_partout_lines';

  @override
  Future<PartOutEngineState> build() async {
    final prefs = await SharedPreferences.getInstance();
    final pRaw = prefs.getString(_pKey);
    final lRaw = prefs.getString(_lKey);
    
    final pList = pRaw != null ? (jsonDecode(pRaw) as List).map((e) => PartOutProjectModel.fromMap(e)).toList() : <PartOutProjectModel>[];
    final lList = lRaw != null ? (jsonDecode(lRaw) as List).map((e) => PartOutLineModel.fromMap(e)).toList() : <PartOutLineModel>[];

    if (kIsWeb) {
      return _computeState(pList, lList, '');
    } else {
      return await Isolate.run(() => _computeState(pList, lList, ''));
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
    final pList = state.value!.projects.map((e) => e.project).toList();
    final idx = pList.indexWhere((e) => e.id == project.id);
    if (idx == -1) {
      pList.insert(0, project); 
    } else {
      pList[idx] = project;
    }
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_pKey, jsonEncode(pList.map((e) => e.toMap()).toList()));
    ref.read(syncEngineProvider.notifier).enqueueMutation('partout_project', '/partout/projects/${project.id}', idx == -1 ? 'POST' : 'PATCH', project.toMap());
    ref.invalidateSelf();
  }
  
  Future<void> saveLine(PartOutLineModel line) async {
    final lList = state.value!.projects.expand((e) => e.lines).toList();
    final idx = lList.indexWhere((e) => e.id == line.id);
    if (idx == -1) {
      lList.insert(0, line); 
    } else {
      lList[idx] = line;
    }
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_lKey, jsonEncode(lList.map((e) => e.toMap()).toList()));
    ref.read(syncEngineProvider.notifier).enqueueMutation('partout_line', '/partout/lines/${line.id}', idx == -1 ? 'POST' : 'PATCH', line.toMap());
    ref.invalidateSelf();
  }

  void search(String query) async {
    if (state.value == null) return;
    final curr = state.value!;
    
    if (kIsWeb) {
      state = AsyncValue.data(_computeState(curr.projects.map((e) => e.project).toList(), curr.projects.expand((e) => e.lines).toList(), query));
    } else {
      state = AsyncValue.data(await Isolate.run(() => _computeState(curr.projects.map((e) => e.project).toList(), curr.projects.expand((e) => e.lines).toList(), query)));
    }
  }
}

final partOutEngineProvider = AsyncNotifierProvider<PartOutEngine, PartOutEngineState>(PartOutEngine.new);