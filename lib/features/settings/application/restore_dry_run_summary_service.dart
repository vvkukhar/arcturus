import 'package:lego_trading_manager/features/settings/application/restore_dry_run_summary_model.dart';

class RestoreDryRunSummaryService {
  RestoreDryRunSummaryModel build(String raw) {
    final text = raw.trim();

    return RestoreDryRunSummaryModel(
      charCount: raw.length,
      lineCount: raw.isEmpty ? 0 : '\n'.allMatches(raw).length + 1,
      looksLikeJson: text.startsWith('{') || text.startsWith('['),
      looksLikeArray: text.startsWith('['),
      looksLikeObject: text.startsWith('{'),
    );
  }
}