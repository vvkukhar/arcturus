import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';

class SearchResult {
  final String id, title, subtitle, type, route;
  final int score;

  const SearchResult(this.id, this.title, this.subtitle, this.type, this.route, this.score);
  
  Map<String, dynamic> toMap() => {'id': id, 'title': title, 'subtitle': subtitle, 'type': type, 'route': route, 'score': score};
  factory SearchResult.fromMap(Map<String, dynamic> map) => SearchResult(map['id'], map['title'], map['subtitle'], map['type'], map['route'], map['score']);
}

class SearchEngineState {
  final String query;
  final String? typeFilter;
  final List<String> recentQueries;
  final List<SearchResult> pinnedResults;
  final List<SearchResult> searchResults;

  const SearchEngineState({required this.query, this.typeFilter, required this.recentQueries, required this.pinnedResults, required this.searchResults});

  SearchEngineState copyWith({String? query, String? typeFilter, List<String>? recentQueries, List<SearchResult>? pinnedResults, List<SearchResult>? searchResults}) {
    return SearchEngineState(query: query ?? this.query, typeFilter: typeFilter ?? this.typeFilter, recentQueries: recentQueries ?? this.recentQueries, pinnedResults: pinnedResults ?? this.pinnedResults, searchResults: searchResults ?? this.searchResults);
  }
}

class SearchEngine extends AsyncNotifier<SearchEngineState> {
  static const _recentKey = 'arcturus_search_recent';
  static const _pinnedKey = 'arcturus_search_pinned';

  @override
  Future<SearchEngineState> build() async {
    final prefs = await SharedPreferences.getInstance();
    final rRaw = prefs.getString(_recentKey);
    final pRaw = prefs.getString(_pinnedKey);
    
    final recent = rRaw != null ? List<String>.from(jsonDecode(rRaw)) : <String>[];
    final pinned = pRaw != null ? (jsonDecode(pRaw) as List).map((e) => SearchResult.fromMap(e)).toList() : <SearchResult>[];

    return SearchEngineState(query: '', recentQueries: recent, pinnedResults: pinned, searchResults: []);
  }

  int _fuzzyScore(String query, String text) {
    final q = query.trim().toLowerCase();
    final t = text.trim().toLowerCase();
    if (q.isEmpty || t.isEmpty) return 0;
    if (t == q) return 1000;
    if (t.startsWith(q)) return 800;
    if (t.contains(q)) return 600;
    return 0;
  }

  void search(String query, {String? typeFilter}) {
    if (state.value == null) return;
    final curr = state.value!;
    
    if (query.trim().isEmpty) {
      state = AsyncValue.data(curr.copyWith(query: query, typeFilter: typeFilter, searchResults: []));
      return;
    }

    final results = <SearchResult>[];
    void check(String id, String title, String subtitle, String type, String route) {
      if (typeFilter != null && typeFilter != type) return;
      int score = _fuzzyScore(query, title);
      score += _fuzzyScore(query, subtitle) ~/ 2;
      if (score > 0) {
        results.add(SearchResult(id, title, subtitle, type, route, score));
      }
    }

    for (final i in ref.read(inventoryRepositoryProvider).getAllItems()) { check(i.id, i.title, 'Inventory • ${i.status.name}', 'inventory', '/inventory'); }
    for (final w in ref.read(watchlistRepositoryProvider).getAll()) { check(w.id, w.title, 'Watchlist • Target ${w.desiredBuyPrice}', 'watchlist', '/watchlist'); }
    for (final p in ref.read(purchasesRepositoryProvider).getAllPurchases()) { check(p.id, p.source, 'Purchase • ${p.finalTotal} ${p.currency}', 'purchase', '/purchases'); }
    for (final s in ref.read(salesRepositoryProvider).getAllSales()) { check(s.id, s.platform, 'Sale • Net ${s.finalNet} ${s.currency}', 'sale', '/sales'); }
    for (final m in ref.read(marketRepositoryProvider).getAll()) { check(m.id, m.source, 'Market • Avg ${m.averagePrice}', 'market', '/market'); }

    results.sort((a, b) => b.score.compareTo(a.score));

    state = AsyncValue.data(curr.copyWith(query: query, typeFilter: typeFilter, searchResults: results));
  }

  Future<void> saveRecentQuery(String query) async {
    final q = query.trim();
    if (q.isEmpty || state.value == null) return;
    final next = [q, ...state.value!.recentQueries.where((e) => e != q)].take(8).toList();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_recentKey, jsonEncode(next));
    state = AsyncValue.data(state.value!.copyWith(recentQueries: next));
  }

  Future<void> togglePin(SearchResult result) async {
    if (state.value == null) return;
    final curr = state.value!;
    final next = List<SearchResult>.from(curr.pinnedResults);
    final idx = next.indexWhere((e) => e.id == result.id && e.type == result.type);
    
    if (idx != -1) {
      next.removeAt(idx); 
    } else {
      next.insert(0, result);
    }
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_pinnedKey, jsonEncode(next.map((e) => e.toMap()).toList()));
    state = AsyncValue.data(curr.copyWith(pinnedResults: next));
  }
}

final searchEngineProvider = AsyncNotifierProvider<SearchEngine, SearchEngineState>(SearchEngine.new);