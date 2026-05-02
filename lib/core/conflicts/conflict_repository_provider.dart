import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/conflicts/conflict_repository.dart';
import 'package:lego_trading_manager/core/storage/app_database_provider.dart';

final conflictRepositoryProvider = Provider<ConflictRepository>((ref) {
  final database = ref.watch(appDatabaseProvider);
  return ConflictRepository(database);
});
