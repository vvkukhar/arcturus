import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/partout_line_model.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';
import 'package:lego_trading_manager/features/partout/application/partout_state.dart';

class PartOutController extends Notifier<PartOutState> {
  @override
  PartOutState build() {
    Future.microtask(() => load());
    return PartOutState.initial();
  }

  void load() {
    final repository = ref.read(partOutRepositoryProvider);
    state = state.copyWith(projects: repository.getAllProjects());
  }

  List<PartOutLineModel> getLines(String projectId) {
    return ref.read(partOutRepositoryProvider).getLinesByProjectId(projectId);
  }

  Future<void> addProject(PartOutProjectModel project) async {
    await ref.read(partOutRepositoryProvider).addProject(project);
    load();
  }

  Future<void> updateProject(PartOutProjectModel project) async {
    await ref.read(partOutRepositoryProvider).updateProject(project);
    load();
  }

  Future<void> deleteProject(String id) async {
    await ref.read(partOutRepositoryProvider).deleteProject(id);
    load();
  }

  Future<void> addLine(PartOutLineModel line) async {
    await ref.read(partOutRepositoryProvider).addLine(line);
    load();
  }

  Future<void> updateLine(PartOutLineModel line) async {
    await ref.read(partOutRepositoryProvider).updateLine(line);
    load();
  }

  Future<void> deleteLine({required String lineId, required String projectId}) async {
    await ref.read(partOutRepositoryProvider).deleteLine(lineId);
    load();
  }
}

final partOutControllerProvider =
    NotifierProvider<PartOutController, PartOutState>(
  PartOutController.new,
);