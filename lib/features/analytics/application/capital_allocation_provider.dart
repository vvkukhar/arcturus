import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/analytics/application/capital_allocation_entry_model.dart';

final capitalAllocationProvider =
    Provider<List<CapitalAllocationEntryModel>>((ref) {
  final items = ref.watch(inventoryRepositoryProvider).getAllItems();

  double planned = 0;
  double purchased = 0;
  double listed = 0;
  double sold = 0;
  double reserved = 0;
  double other = 0;

  for (final item in items) {
    final cost = item.totalCost.toDouble();
    final statusName = item.status.name;

    switch (statusName) {
      case 'planned':
        planned += cost;
        break;
      case 'purchased':
      case 'received':
      case 'inDelivery':
      case 'restoring':
      case 'readyForSale':
      case 'found':
        purchased += cost;
        break;
      case 'listed':
        listed += cost;
        break;
      case 'reserved':
        reserved += cost;
        break;
      case 'sold':
        sold += cost;
        break;
      default:
        other += cost;
        break;
    }
  }

  final result = <CapitalAllocationEntryModel>[
    CapitalAllocationEntryModel(label: 'Planned', amount: planned),
    CapitalAllocationEntryModel(label: 'Purchased', amount: purchased),
    CapitalAllocationEntryModel(label: 'Listed', amount: listed),
    CapitalAllocationEntryModel(label: 'Reserved', amount: reserved),
    CapitalAllocationEntryModel(label: 'Sold', amount: sold),
  ];

  if (other > 0) {
    result.add(CapitalAllocationEntryModel(label: 'Other', amount: other));
  }

  return result;
});