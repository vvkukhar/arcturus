import 'package:flutter_riverpod/flutter_riverpod.dart';

class GlobalSearchScopeNotifier extends Notifier<String?> {
  @override
  String? build() => null;

  void set(String? value) {
    state = value;
  }
}

final globalSearchScopeProvider =
    NotifierProvider<GlobalSearchScopeNotifier, String?>(
  GlobalSearchScopeNotifier.new,
);