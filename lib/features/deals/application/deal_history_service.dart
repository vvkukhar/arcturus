import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/cache_repository_provider.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/features/deals/application/deal_evaluation_model.dart';
import 'package:lego_trading_manager/features/deals/application/deal_history_entry_model.dart';

class DealHistoryService {
  final Ref ref;
  static const String _key = 'deal_history_entries';

  DealHistoryService(this.ref);

  Future<List<DealHistoryEntryModel>> getAll() async {
    final raw = await ref.read(cacheRepositoryProvider).get(_key);
    if (raw == null || raw.isEmpty) return [];

    final list = jsonDecode(raw) as List<dynamic>;

    return list.map((e) {
      final map = Map<String, dynamic>.from(e as Map);
      return DealHistoryEntryModel(
        id: map['id'] as String,
        title: map['title'] as String,
        askingPrice: (map['askingPrice'] as num).toDouble(),
        marketPrice: (map['marketPrice'] as num).toDouble(),
        expectedProfit: (map['expectedProfit'] as num).toDouble(),
        marginPercent: (map['marginPercent'] as num).toDouble(),
        verdict: map['verdict'] as String,
        createdAt: DateTime.parse(map['createdAt'] as String),
      );
    }).toList();
  }

  Future<void> add(DealEvaluationModel model) async {
    final current = await getAll();

    final next = [
      DealHistoryEntryModel(
        id: IdGenerator.next(),
        title: model.title,
        askingPrice: model.askingPrice,
        marketPrice: model.marketPrice,
        expectedProfit: model.expectedProfit,
        marginPercent: model.marginPercent,
        verdict: model.verdict,
        createdAt: DateTime.now(),
      ),
      ...current,
    ];

    await ref.read(cacheRepositoryProvider).set(
          _key,
          jsonEncode(
            next
                .map(
                  (e) => {
                    'id': e.id,
                    'title': e.title,
                    'askingPrice': e.askingPrice,
                    'marketPrice': e.marketPrice,
                    'expectedProfit': e.expectedProfit,
                    'marginPercent': e.marginPercent,
                    'verdict': e.verdict,
                    'createdAt': e.createdAt.toIso8601String(),
                  },
                )
                .toList(),
          ),
        );
  }

  Future<void> clear() async {
    await ref.read(cacheRepositoryProvider).delete(_key);
  }
}
