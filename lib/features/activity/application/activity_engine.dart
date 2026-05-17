import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';

class ActivityLogEntryModel {
  final String id;
  final String action;
  final String type;
  final String title;
  final String subtitle;
  final Map<String, dynamic> payload;
  final DateTime createdAt;

  const ActivityLogEntryModel({
    required this.id,
    required this.action,
    required this.type,
    required this.title,
    required this.subtitle,
    required this.payload,
    required this.createdAt,
  });

  factory ActivityLogEntryModel.fromMap(Map<String, dynamic> map) {
    final action = map['action'] as String? ?? 'unknown';
    final type = action.split('.').first;
    return ActivityLogEntryModel(
      id: map['id'],
      action: action,
      type: type,
      title: action.replaceAll('_', ' ').toUpperCase(),
      subtitle: map['payloadJson']?.toString() ?? 'Executed operation',
      payload: map['payloadJson'] != null ? Map<String, dynamic>.from(map['payloadJson']) : {},
      createdAt: DateTime.tryParse(map['createdAt'] ?? '') ?? DateTime.now(),
    );
  }
}

class ActivityEngineState {
  final List<ActivityLogEntryModel> logs;
  final List<ActivityLogEntryModel> visibleLogs;
  final double controlScore;
  final String momKey;
  final String discKey;
  final int activeDayStreak;
  final int activeDaysInLast7;
  final int bestDayCount;
  final String topType;
  final int reports;
  final int purchases;
  final int sales;
  final int watchlist;
  final String? typeFilter;
  final String searchQuery;

  const ActivityEngineState({
    required this.logs,
    required this.visibleLogs,
    this.controlScore = 95.0,
    this.momKey = 'activity.mom.strong',
    this.discKey = 'activity.disc.strong',
    this.activeDayStreak = 12,
    this.activeDaysInLast7 = 7,
    this.bestDayCount = 24,
    this.topType = 'Sales',
    this.reports = 0,
    this.purchases = 0,
    this.sales = 0,
    this.watchlist = 0,
    this.typeFilter,
    this.searchQuery = '',
  });

  ActivityEngineState copyWith({
    List<ActivityLogEntryModel>? logs,
    List<ActivityLogEntryModel>? visibleLogs,
    String? typeFilter,
    String? searchQuery,
  }) {
    return ActivityEngineState(
      logs: logs ?? this.logs,
      visibleLogs: visibleLogs ?? this.visibleLogs,
      controlScore: controlScore,
      momKey: momKey,
      discKey: discKey,
      activeDayStreak: activeDayStreak,
      activeDaysInLast7: activeDaysInLast7,
      bestDayCount: bestDayCount,
      topType: topType,
      reports: reports,
      purchases: purchases,
      sales: sales,
      watchlist: watchlist,
      typeFilter: typeFilter ?? this.typeFilter,
      searchQuery: searchQuery ?? this.searchQuery,
    );
  }
}

class ActivityEngine extends AsyncNotifier<ActivityEngineState> {
  @override
  Future<ActivityEngineState> build() async {
    final eventBus = ref.watch(socketEventBusProvider);
    final sub = eventBus.events.listen((event) {
      ref.invalidateSelf();
    });
    ref.onDispose(() => sub.cancel());

    final network = ref.read(networkCoreProvider);
    try {
      final response = await network.request('GET', '/activity?limit=100');
      final logs = response is List ? response.map((e) => ActivityLogEntryModel.fromMap(Map<String, dynamic>.from(e))).toList() : <ActivityLogEntryModel>[];
      
      return ActivityEngineState(
        logs: logs,
        visibleLogs: logs,
        purchases: logs.where((e) => e.type == 'purchase' || e.action.contains('purchase')).length,
        sales: logs.where((e) => e.type == 'sale' || e.action.contains('sale')).length,
      );
    } catch (e) {
      return const ActivityEngineState(logs: [], visibleLogs: []);
    }
  }

  void filter(String query, String? type) {
    final curr = state.valueOrNull;
    if (curr == null) return;
    
    final q = query.toLowerCase();
    final filtered = curr.logs.where((l) {
      final matchQ = q.isEmpty || l.title.toLowerCase().contains(q) || l.subtitle.toLowerCase().contains(q);
      final matchT = type == null || l.type == type;
      return matchQ && matchT;
    }).toList();

    state = AsyncValue.data(curr.copyWith(searchQuery: query, typeFilter: type, visibleLogs: filtered));
  }

  void clear() {
    state = const AsyncValue.data(ActivityEngineState(logs: [], visibleLogs: []));
  }
}

final activityEngineProvider = AsyncNotifierProvider<ActivityEngine, ActivityEngineState>(ActivityEngine.new);