class WatchlistAutoTriggerCandidateModel {
  final String id;
  final String title;
  final double marketPrice;
  final double desiredPrice;
  final bool shouldTrigger;

  const WatchlistAutoTriggerCandidateModel({
    required this.id,
    required this.title,
    required this.marketPrice,
    required this.desiredPrice,
    required this.shouldTrigger,
  });
}
