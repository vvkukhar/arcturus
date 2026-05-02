class GlobalSearchQuerySharpnessModel {
  final String label;
  final int queryLength;
  final bool hasExactTopHit;

  const GlobalSearchQuerySharpnessModel({
    required this.label,
    required this.queryLength,
    required this.hasExactTopHit,
  });
}
