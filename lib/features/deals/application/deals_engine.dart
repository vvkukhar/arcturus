import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DealEvaluation {
  final String id;
  final String title;
  final double askingPrice;
  final double marketPrice;
  final double expectedProfit;
  final double marginPercent;
  final String verdict;
  final DateTime createdAt;

  const DealEvaluation({required this.id, required this.title, required this.askingPrice, required this.marketPrice, required this.expectedProfit, required this.marginPercent, required this.verdict, required this.createdAt});

  Map<String, dynamic> toMap() => {'id': id, 'title': title, 'askingPrice': askingPrice, 'marketPrice': marketPrice, 'expectedProfit': expectedProfit, 'marginPercent': marginPercent, 'verdict': verdict, 'createdAt': createdAt.toIso8601String()};

  factory DealEvaluation.fromMap(Map<String, dynamic> map) => DealEvaluation(id: map['id'] as String, title: map['title'] as String, askingPrice: (map['askingPrice'] as num).toDouble(), marketPrice: (map['marketPrice'] as num).toDouble(), expectedProfit: (map['expectedProfit'] as num).toDouble(), marginPercent: (map['marginPercent'] as num).toDouble(), verdict: map['verdict'] as String, createdAt: DateTime.parse(map['createdAt'] as String));
}

class DealsEngine extends AsyncNotifier<List<DealEvaluation>> {
  static const _key = 'arcturus_deal_history';

  @override
  Future<List<DealEvaluation>> build() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw == null || raw.isEmpty) return [];
    final list = jsonDecode(raw) as List;
    return list.map((e) => DealEvaluation.fromMap(Map<String, dynamic>.from(e))).toList();
  }

  DealEvaluation evaluate({required String title, required double askingPrice, required double marketPrice}) {
    final profit = marketPrice - askingPrice;
    
    // ФІКС: Маржа рахується від Market Price (Доходу), а не від Asking Price!
    final margin = marketPrice <= 0 ? 0.0 : (profit / marketPrice) * 100;
    
    // А от для verdict ми використовуємо ROI (відношення до витрат)
    final roi = askingPrice <= 0 ? 0.0 : (profit / askingPrice) * 100;
    
    String verdict = 'weak';
    if (profit <= 0) {
      verdict = 'avoid';
    } else if (roi >= 40) { // Оцінюємо по справжньому ROI
      verdict = 'strong buy';
    } else if (roi >= 20) {
      verdict = 'good';
    }

    return DealEvaluation(
      id: DateTime.now().microsecondsSinceEpoch.toString(), 
      title: title.trim().isEmpty ? 'Untitled Deal' : title.trim(), 
      askingPrice: askingPrice, 
      marketPrice: marketPrice, 
      expectedProfit: profit, 
      marginPercent: margin, // Тепер тут реальна маржа
      verdict: verdict, 
      createdAt: DateTime.now()
    );
  }

  Future<void> saveEvaluation(DealEvaluation deal) async {
    final current = state.value ?? [];
    final next = [deal, ...current];
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode(next.map((e) => e.toMap()).toList()));
    state = AsyncValue.data(next);
  }

  Future<void> clearHistory() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
    state = const AsyncValue.data([]);
  }
}

final dealsEngineProvider = AsyncNotifierProvider<DealsEngine, List<DealEvaluation>>(DealsEngine.new);