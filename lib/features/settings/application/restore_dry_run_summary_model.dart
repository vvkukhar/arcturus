class RestoreDryRunSummaryModel {
  final int charCount;
  final int lineCount;
  final bool looksLikeJson;
  final bool looksLikeArray;
  final bool looksLikeObject;

  const RestoreDryRunSummaryModel({
    required this.charCount,
    required this.lineCount,
    required this.looksLikeJson,
    required this.looksLikeArray,
    required this.looksLikeObject,
  });
}