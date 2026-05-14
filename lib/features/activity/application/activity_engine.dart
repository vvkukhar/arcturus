import 'dart:convert';
import 'dart:isolate';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ActivityLogEntryModel {
  final String id, title, subtitle, type;
  final DateTime createdAt;

  const ActivityLogEntryModel({required this.id, required this.title, required this.subtitle, required this.createdAt, required this.type});

  Map<String, dynamic> toMap() => {'id': id, 'title': title, 'subtitle': subtitle, 'createdAt': createdAt.toIso8601String(), 'type': type};

  factory ActivityLogEntryModel.fromMap(Map<String, dynamic> map) => ActivityLogEntryModel(id: map['id'] as String? ?? DateTime.now().microsecondsSinceEpoch.toString(), title: map['title'] as String, subtitle: map['subtitle'] as String, createdAt: DateTime.parse(map['createdAt'] as String), type: map['type'] as String);
}

class ActivityEngineState {
  final List<ActivityLogEntryModel> logs, visibleLogs;
  final int reports, purchases, sales, watchlist, topTypeCount, activeDayStreak, purchaseDayStreak, activeDaysInLast7, totalDaysTracked, bestDayCount, weakestDayCount;
  final String topType, momentumLabel, disciplineLabel, stabilityLabel, bestDay, weakestDay, searchQuery;
  final String? typeFilter;
  final double controlScore;

  const ActivityEngineState({required this.logs, required this.visibleLogs, required this.reports, required this.purchases, required this.sales, required this.watchlist, required this.topType, required this.topTypeCount, required this.activeDayStreak, required this.purchaseDayStreak, required this.activeDaysInLast7, required this.totalDaysTracked, required this.momentumLabel, required this.disciplineLabel, required this.stabilityLabel, required this.controlScore, required this.bestDay, required this.bestDayCount, required this.weakestDay, required this.weakestDayCount, required this.searchQuery, this.typeFilter});
}

class ActivityEngine extends AsyncNotifier<ActivityEngineState> {
  static const _key = 'arcturus_activity_logs';

  @override
  Future<ActivityEngineState> build() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    final items = raw != null && raw.isNotEmpty ? (jsonDecode(raw) as List).map((e) => ActivityLogEntryModel.fromMap(Map<String, dynamic>.from(e))).toList() : <ActivityLogEntryModel>[];
    return await Isolate.run(() => _computeState(items, '', null));
  }

  static ActivityEngineState _computeState(List<ActivityLogEntryModel> items, String query, String? type) {
    if (items.isEmpty) {
      return const ActivityEngineState(logs: [], visibleLogs: [], reports: 0, purchases: 0, sales: 0, watchlist: 0, topType: '-', topTypeCount: 0, activeDayStreak: 0, purchaseDayStreak: 0, activeDaysInLast7: 0, totalDaysTracked: 0, momentumLabel: 'No momentum', disciplineLabel: 'No discipline', stabilityLabel: 'No stability', controlScore: 0, bestDay: '-', bestDayCount: 0, weakestDay: '-', weakestDayCount: 0, searchQuery: '', typeFilter: null);
    }

    final queryLower = query.trim().toLowerCase();
    final visible = items.where((e) {
      if (type != null && e.type != type) return false;
      return queryLower.isEmpty || e.title.toLowerCase().contains(queryLower) || e.subtitle.toLowerCase().contains(queryLower);
    }).toList();

    int r = 0, p = 0, s = 0, w = 0, act7 = 0;
    final typeCounts = <String, int>{}, dayCounts = <String, int>{};
    final uniqueDays = <String>{}, purDays = <String>{};
    final sevenAgo = DateTime.now().subtract(const Duration(days: 7));

    for (final item in items) {
      final t = item.type;
      if (t == 'report') { r++; } 
      else if (t == 'purchase') { p++; } 
      else if (t == 'sale') { s++; } 
      else if (t == 'watchlist') { w++; }

      typeCounts[t] = (typeCounts[t] ?? 0) + 1;
      final dayKey = item.createdAt.toIso8601String().split('T').first;
      
      if (uniqueDays.add(dayKey) && item.createdAt.isAfter(sevenAgo)) { act7++; }
      dayCounts[dayKey] = (dayCounts[dayKey] ?? 0) + 1;
      if (t == 'purchase') { purDays.add(dayKey); }
    }

    String topT = '-'; int topC = 0;
    typeCounts.forEach((k, v) { if (v > topC) { topC = v; topT = k; } });

    String bDay = '-'; int bCount = -1;
    String wDay = '-'; int wCount = 999999;
    dayCounts.forEach((k, v) {
      if (v > bCount) { bCount = v; bDay = k; }
      if (v < wCount) { wCount = v; wDay = k; }
    });

    int calcStreak(Set<String> days) {
      int streak = 0;
      var cursor = DateTime.now();
      while (days.contains(cursor.toIso8601String().split('T').first)) {
        streak++;
        cursor = cursor.subtract(const Duration(days: 1));
      }
      return streak;
    }

    final actStreak = calcStreak(uniqueDays), purStreak = calcStreak(purDays);
    final mom = actStreak >= 5 ? 'Strong' : actStreak >= 2 ? 'Stable' : 'Weak';
    final disc = act7 >= 5 ? 'Strong' : act7 >= 3 ? 'Forming' : 'Inconsistent';
    final stab = act7 >= 6 ? 'Very Strong' : act7 >= 4 ? 'Stable' : 'Fragile';
    
    double ctrl = (act7 >= 6 ? 50 : act7 >= 4 ? 35 : act7 >= 2 ? 20 : 0).toDouble();
    ctrl += (uniqueDays.length >= 14 ? 30 : uniqueDays.length >= 7 ? 20 : uniqueDays.isNotEmpty ? 10 : 0);

    return ActivityEngineState(logs: items, visibleLogs: visible, reports: r, purchases: p, sales: s, watchlist: w, topType: topT, topTypeCount: topC, activeDayStreak: actStreak, purchaseDayStreak: purStreak, activeDaysInLast7: act7, totalDaysTracked: uniqueDays.length, momentumLabel: mom, disciplineLabel: disc, stabilityLabel: stab, controlScore: ctrl, bestDay: bDay, bestDayCount: bCount == -1 ? 0 : bCount, weakestDay: wDay, weakestDayCount: wCount == 999999 ? 0 : wCount, searchQuery: query, typeFilter: type);
  }

  Future<void> logAction(String title, String subtitle, String type) async {
    final entry = ActivityLogEntryModel(id: DateTime.now().microsecondsSinceEpoch.toString(), title: title, subtitle: subtitle, createdAt: DateTime.now(), type: type);
    final next = <ActivityLogEntryModel>[entry, ...(state.value?.logs ?? [])];
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode(next.map((e) => e.toMap()).toList()));
    state = AsyncValue.data(await Isolate.run(() => _computeState(next, state.value?.searchQuery ?? '', state.value?.typeFilter)));
  }

  void filter(String query, String? type) async {
    if (state.value == null) return;
    state = AsyncValue.data(await Isolate.run(() => _computeState(state.value!.logs, query, type)));
  }

  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
    state = AsyncValue.data(await Isolate.run(() => _computeState(const [], '', null)));
  }
}

final activityEngineProvider = AsyncNotifierProvider<ActivityEngine, ActivityEngineState>(ActivityEngine.new);