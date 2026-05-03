import 'package:lego_trading_manager/data/models/partout_project_model.dart';

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