import 'package:lego_trading_manager/data/datasources/local/partout_local_datasource.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';
import 'package:lego_trading_manager/data/models/partout_line_model.dart';

class PartOutRepository {
  final PartOutLocalDatasource _localDatasource;
  List<PartOutProjectModel> _projectsCache = [];
  List<PartOutLineModel> _linesCache = [];
  bool _isLoaded = false;

  PartOutRepository(this._localDatasource);

  Future<void> loadCache() async {
    _projectsCache = await _localDatasource.getAllProjects();
    _linesCache = await _localDatasource.getAllLines();
    _isLoaded = true;
  }

  List<PartOutProjectModel> getAllProjects() {
    if (!_isLoaded) throw StateError('PartOutRepository accessed before loadCache()');
    return List<PartOutProjectModel>.from(_projectsCache);
  }

  PartOutProjectModel? getProjectById(String id) {
    if (!_isLoaded) throw StateError('PartOutRepository accessed before loadCache()');
    try {
      return _projectsCache.firstWhere((p) => p.id == id);
    } catch (_) {
      return null;
    }
  }

  List<PartOutLineModel> getLinesByProjectId(String projectId) {
    if (!_isLoaded) throw StateError('PartOutRepository accessed before loadCache()');
    return _linesCache.where((line) => line.projectId == projectId).toList();
  }

  Future<void> addProject(PartOutProjectModel project) async {
    await _localDatasource.addProject(project);
    _projectsCache.insert(0, project);
  }

  Future<void> updateProject(PartOutProjectModel project) async {
    await _localDatasource.updateProject(project);
    final index = _projectsCache.indexWhere((e) => e.id == project.id);
    if (index != -1) {
      _projectsCache[index] = project;
    }
  }

  Future<void> deleteProject(String id) async {
    await _localDatasource.deleteProject(id);
    _projectsCache.removeWhere((p) => p.id == id);
    _linesCache.removeWhere((l) => l.projectId == id);
  }

  Future<void> addLine(PartOutLineModel line) async {
    await _localDatasource.addLine(line);
    _linesCache.insert(0, line);
  }

  Future<void> updateLine(PartOutLineModel line) async {
    await _localDatasource.updateLine(line);
    final index = _linesCache.indexWhere((e) => e.id == line.id);
    if (index != -1) {
      _linesCache[index] = line;
    }
  }

  Future<void> deleteLine(String id) async {
    await _localDatasource.deleteLine(id);
    _linesCache.removeWhere((l) => l.id == id);
  }

  Future<void> replaceAll({required List<PartOutProjectModel> projects, required List<PartOutLineModel> lines}) async {
    await _localDatasource.replaceAllProjects(projects);
    await _localDatasource.replaceAllLines(lines);
    _projectsCache = List.from(projects);
    _linesCache = List.from(lines);
  }
}