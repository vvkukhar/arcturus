import 'package:flutter_riverpod/flutter_riverpod.dart';

class GlobalSearchDefaultScopeNotifier extends Notifier<String?> {
  @override
  String? build() => null;

  void set(String? value) {
    state = value;
  }
}

final globalSearchDefaultScopeProvider =
    NotifierProvider<GlobalSearchDefaultScopeNotifier, String?>(
  GlobalSearchDefaultScopeNotifier.new,
);