// lib/data/repositories/partout_repository.dart

import 'package:lego_trading_manager/data/models/partout_line_model.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';
import 'package:lego_trading_manager/data/store/partout_memory_store.dart';

class PartOutRepository {
  List<PartOutProjectModel> getAllProjects() {
    return PartOutMemoryStore.projects;
  }

  PartOutProjectModel? getProjectById(String id) {
    return PartOutMemoryStore.getProjectById(id);
  }

  List<PartOutLineModel> getLinesByProjectId(String projectId) {
    return PartOutMemoryStore.getLinesByProjectId(projectId);
  }

  void addProject(PartOutProjectModel project) {
    PartOutMemoryStore.addProject(project);
  }

  void updateProject(PartOutProjectModel project) {
    PartOutMemoryStore.updateProject(project);
  }

  void deleteProject(String id) {
    PartOutMemoryStore.deleteProject(id);
  }

  void addLine(PartOutLineModel line) {
    PartOutMemoryStore.addLine(line);
  }

  void updateLine(PartOutLineModel line) {
    PartOutMemoryStore.updateLine(line);
  }

  void deleteLine(String lineId, String projectId) {
    PartOutMemoryStore.deleteLine(lineId);
  }
}
