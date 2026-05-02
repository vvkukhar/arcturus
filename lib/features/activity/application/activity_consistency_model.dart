class ActivityConsistencyModel {
  final int activeDaysInLast7;
  final int totalDaysTracked;
  final String label;

  const ActivityConsistencyModel({
    required this.activeDaysInLast7,
    required this.totalDaysTracked,
    required this.label,
  });
}
