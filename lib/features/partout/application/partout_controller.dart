import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/partout_line_model.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';
import 'package:lego_trading_manager/data/repositories/partout_repository.dart';

class PartOutState {
  final List<PartOutProjectModel> projects;

  const PartOutState({
    required this.projects,
  });

  factory PartOutState.initial() => const PartOutState(projects: []);

  PartOutState copyWith({
    List<PartOutProjectModel>? projects,
  }) {
    return PartOutState(
      projects: projects ?? this.projects,
    );
  }
}

class PartOutController extends StateNotifier<PartOutState> {
  final PartOutRepository repository;

  PartOutController(this.repository) : super(PartOutState.initial()) {
    load();
  }

  void load() {
    state = state.copyWith(
      projects: repository.getAllProjects(),
    );
  }

  List<PartOutLineModel> getLines(String projectId) {
    return repository.getLinesByProjectId(projectId);
  }

  void addProject(PartOutProjectModel project) {
    repository.addProject(project);
    load();
  }

  void updateProject(PartOutProjectModel project) {
    repository.updateProject(project);
    load();
  }

  void deleteProject(String id) {
    repository.deleteProject(id);
    load();
  }

  void addLine(PartOutLineModel line) {
    repository.addLine(line);
    load();
  }

  void updateLine(PartOutLineModel line) {
    repository.updateLine(line);
    load();
  }

  void deleteLine({
    required String lineId,
    required String projectId,
  }) {
    repository.deleteLine(lineId, projectId);
    load();
  }
}

final partOutControllerProvider =
    StateNotifierProvider<PartOutController, PartOutState>((ref) {
  return PartOutController(ref.read(partOutRepositoryProvider));
});
