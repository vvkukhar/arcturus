class ActivityWeeklyStabilityModel {
  final String label;
  final int activeDaysInLast7;
  final int totalTrackedDays;

  const ActivityWeeklyStabilityModel({
    required this.label,
    required this.activeDaysInLast7,
    required this.totalTrackedDays,
  });
}
