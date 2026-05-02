import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/safe_json_list_parser.dart';

final safeJsonListParserProvider = Provider<SafeJsonListParser>((ref) {
  return const SafeJsonListParser();
});