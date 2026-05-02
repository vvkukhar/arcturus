import 'package:lego_trading_manager/core/network/api_client.dart';

class FlowsActionsRepository {
  final ApiClient _api;

  FlowsActionsRepository(this._api);

  Future<void> removePurchase(String id) async {
    await _api.patch('/flows/purchase/remove', body: {'id': id});
  }

  Future<void> removeReprice(String id) async {
    await _api.patch('/flows/reprice/remove', body: {'id': id});
  }

  Future<void> removeReview(String id) async {
    await _api.patch('/flows/review/remove', body: {'id': id});
  }
}
