import 'package:flutter_riverpod/flutter_riverpod.dart';

final globalSearchQueryProvider = StateProvider<String>((ref) {
  return '';
});
