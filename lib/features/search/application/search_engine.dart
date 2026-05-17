import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class SearchResult {
  final String id, title, subKey, type, route;
  final Map<String, String>? subArgs;
  final int score;

  const SearchResult(this.id, this.title, this.subKey, this.type, this.route, this.score, {this.subArgs});
  
  Map<String, dynamic> toMap() => {'id': id, 'title': title, 'subKey': subKey, 'type': type, 'route': route, 'score': score};
  factory SearchResult.fromMap(Map<String, dynamic> map) => SearchResult(map['id'], map['title'], map['subKey'], map['type'], map['route'], map['score']);
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

  void search(String query, {String? typeFilter}) async {
    final curr = state.valueOrNull;
    if (curr == null) return;
    
    if (query.trim().isEmpty) {
      state = AsyncValue.data(curr.copyWith(query: query, typeFilter: typeFilter, searchResults: []));
      return;
    }

    state = const AsyncValue.loading();
    
    try {
      final network = ref.read(networkCoreProvider);
      final q = query.trim();
      final limit = 10;
      final results = <SearchResult>[];

      if (typeFilter == null || typeFilter == 'inventory') {
        final res = await network.request('GET', '/inventory?q=$q&limit=$limit');
        for (var item in (res as List)) {
          results.add(SearchResult(item['id'], item['titleSnapshot'] ?? 'Item', 'search.sub.inv', 'inventory', '/inventory', 100, subArgs: {'status': item['status'] ?? ''}));
        }
      }

      if (typeFilter == null || typeFilter == 'watchlist') {
        final res = await network.request('GET', '/watchlist?q=$q&limit=$limit');
        for (var item in (res as List)) {
          results.add(SearchResult(item['id'], item['titleSnapshot'] ?? 'Target', 'search.sub.watch', 'watchlist', '/watchlist', 90, subArgs: {'price': item['desiredBuyPrice']?.toString() ?? '0'}));
        }
      }

      if (typeFilter == null || typeFilter == 'purchase') {
        final res = await network.request('GET', '/procurement?q=$q&limit=$limit');
        for (var item in (res as List)) {
          results.add(SearchResult(item['id'], item['sourceCode'] ?? 'Purchase', 'search.sub.pur', 'purchase', '/purchases', 80, subArgs: {'total': item['totalCost']?.toString() ?? '0', 'currency': 'UAH'}));
        }
      }

      if (typeFilter == null || typeFilter == 'sale') {
        final res = await network.request('GET', '/sales?q=$q&limit=$limit');
        for (var item in (res as List)) {
          results.add(SearchResult(item['id'], item['channel'] ?? 'Sale', 'search.sub.sale', 'sale', '/sales', 80, subArgs: {'net': item['profit']?.toString() ?? '0', 'currency': 'UAH'}));
        }
      }

      results.sort((a, b) => b.score.compareTo(a.score));
      state = AsyncValue.data(curr.copyWith(query: query, typeFilter: typeFilter, searchResults: results));
    } catch (e) {
      state = AsyncValue.data(curr.copyWith(query: query, typeFilter: typeFilter, searchResults: []));
    }
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