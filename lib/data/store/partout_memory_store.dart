// lib/data/store/partout_memory_store.dart

import 'package:lego_trading_manager/data/models/partout_line_model.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';

class PartOutMemoryStore {
  PartOutMemoryStore._();

  static final List<PartOutProjectModel> _projects = [];
  static final List<PartOutLineModel> _lines = [];

  static List<PartOutProjectModel> get projects => List.from(_projects);

  static List<PartOutLineModel> get lines => List.from(_lines);

  static void replaceAll({
    required List<PartOutProjectModel> projects,
    required List<PartOutLineModel> lines,
  }) {
    _projects
      ..clear()
      ..addAll(projects);
    _lines
      ..clear()
      ..addAll(lines);
  }

  static void hydrate({
    required List<PartOutProjectModel> projects,
    required List<PartOutLineModel> lines,
  }) {
    replaceAll(projects: projects, lines: lines);
  }

  static void addProject(PartOutProjectModel project) {
    _projects.insert(0, project);
  }

  static void updateProject(PartOutProjectModel project) {
    final index = _projects.indexWhere((p) => p.id == project.id);
    if (index == -1) return;
    _projects[index] = project;
  }

  static void deleteProject(String id) {
    _projects.removeWhere((project) => project.id == id);
    _lines.removeWhere((line) => line.projectId == id);
  }

  static void addLine(PartOutLineModel line) {
    _lines.insert(0, line);
  }

  static void updateLine(PartOutLineModel line) {
    final index = _lines.indexWhere((l) => l.id == line.id);
    if (index == -1) return;
    _lines[index] = line;
  }

  static void deleteLine(String id) {
    _lines.removeWhere((line) => line.id == id);
  }

  static List<PartOutLineModel> getLinesByProjectId(String projectId) {
    return _lines.where((line) => line.projectId == projectId).toList();
  }

  static PartOutProjectModel? getProjectById(String id) {
    try {
      return projects.firstWhere((project) => project.id == id);
    } catch (_) {
      return null;
    }
  }

  static void clear() {
    _projects.clear();
    _lines.clear();
  }
}
