import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';

class ActivityLogEntryModel {
  final String id;
  final String action;
  final Map<String, dynamic> payload;
  final DateTime createdAt;

  const ActivityLogEntryModel({
    required this.id,
    required this.action,
    required this.payload,
    required this.createdAt,
  });

  factory ActivityLogEntryModel.fromMap(Map<String, dynamic> map) {
    return ActivityLogEntryModel(
      id: map['id'],
      action: map['action'],
      payload: map['payloadJson'] != null ? Map<String, dynamic>.from(map['payloadJson']) : {},
      createdAt: DateTime.tryParse(map['createdAt'] ?? '') ?? DateTime.now(),
    );
  }
}

class ActivityEngine extends AsyncNotifier<List<ActivityLogEntryModel>> {
  @override
  Future<List<ActivityLogEntryModel>> build() async {
    final eventBus = ref.watch(socketEventBusProvider);
    final sub = eventBus.events.listen((event) {
      ref.invalidateSelf();
    });
    ref.onDispose(() => sub.cancel());

    final network = ref.read(networkCoreProvider);
    try {
      final response = await network.request('GET', '/activity?limit=100');
      if (response is List) {
        return response.map((e) => ActivityLogEntryModel.fromMap(Map<String, dynamic>.from(e))).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}

final activityEngineProvider = AsyncNotifierProvider<ActivityEngine, List<ActivityLogEntryModel>>(ActivityEngine.new);