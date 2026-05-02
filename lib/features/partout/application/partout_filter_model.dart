import 'package:lego_trading_manager/data/models/partout_project_status.dart';

class PartOutFilterModel {
  final PartOutProjectStatus? status;
  final String? titleContains;
  final bool onlyProfitableExpected;
  final bool onlyProfitableActual;
  final bool onlyWithNotes;

  const PartOutFilterModel({
    this.status,
    this.titleContains,
    this.onlyProfitableExpected = false,
    this.onlyProfitableActual = false,
    this.onlyWithNotes = false,
  });

  static const empty = PartOutFilterModel();

  PartOutFilterModel copyWith({
    PartOutProjectStatus? status,
    String? titleContains,
    bool? onlyProfitableExpected,
    bool? onlyProfitableActual,
    bool? onlyWithNotes,
    bool clearStatus = false,
    bool clearTitleContains = false,
  }) {
    return PartOutFilterModel(
      status: clearStatus ? null : (status ?? this.status),
      titleContains:
          clearTitleContains ? null : (titleContains ?? this.titleContains),
      onlyProfitableExpected:
          onlyProfitableExpected ?? this.onlyProfitableExpected,
      onlyProfitableActual: onlyProfitableActual ?? this.onlyProfitableActual,
      onlyWithNotes: onlyWithNotes ?? this.onlyWithNotes,
    );
  }
}