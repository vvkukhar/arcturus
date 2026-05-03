import 'package:flutter_riverpod/flutter_riverpod.dart';

class CommandCenterSearchNotifier extends Notifier<String> {
  @override
  String build() => '';

  void set(String value) {
    state = value;
  }
}

final commandCenterSearchProvider = NotifierProvider<CommandCenterSearchNotifier, String>(
  CommandCenterSearchNotifier.new,
);